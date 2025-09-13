import { Injectable } from '@nestjs/common';
import { AppLogger } from '@logger/logger.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from './../config/notification.config';

@Injectable()
export class ConsumerService {
  private transporter;
  private emailConfig;

  constructor(
    private readonly logger: AppLogger,
    private readonly configService: ConfigService
  ) {
    this.emailConfig = this.configService.getEmailConfig();
    
    if (!this.emailConfig.user || !this.emailConfig.pass) {
      this.logger.error('Email credentials not configured!');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.emailConfig.user,
        pass: this.emailConfig.pass,
      },
    });

    this.verifyTransporter().catch(error => {
      this.logger.error('Failed to verify transporter:', error);
    });
  }

  private async verifyTransporter() {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP transporter is ready and verified');
    } catch (error) {
      this.logger.error('SMTP transporter verification failed:', error);
    }
  }

  async process(event: any) {
    try {
      // Validasi event
      if (!event || typeof event !== 'object') {
        this.logger.warn('Received invalid event payload', event);
        return;
      }

      // Pastikan transporter sudah siap
      if (!this.transporter) {
        this.logger.error('Email transporter not initialized');
        return;
      }

      // Log full payload untuk memastikan
      this.logger.log('Processing event:', JSON.stringify(event, null, 2));

      // Destructuring langsung dari event
      const { 
        orderId = 'UNKNOWN_ORDER', 
        itemId = [],
        id = 'UNKNOWN_ID'
      } = event;

      // GUNAKAN EMAIL_CLIENT1 DARI CONFIG SERVICE
      const customerEmail = this.emailConfig.client_one || "untukdummy687@gmail.com";
      const items = Array.isArray(itemId) ? itemId : [itemId];

      // Kirim email
      const mailOptions = {
        from: `"Admin Multi Power Group" <${this.emailConfig.user}>`,
        to: customerEmail,
        subject: `Order Confirmation: ${orderId}`,
        html: `
          <h2>Order Confirmation</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Internal ID:</strong> ${id}</p>
          <p><strong>Items:</strong> ${items.join(', ')}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
          <br/>
          <p>Thank you for your order!</p>
        `,
      };

      try {
        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email sent for orderId=${orderId} to ${customerEmail}`);
      } catch (err) {
        this.logger.error(`Failed to send email for orderId=${orderId}`, err);
      }
    } catch (error) {
      this.logger.error('Error processing event:', error, event);
    }
  }
}