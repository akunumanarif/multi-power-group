import { Injectable } from '@nestjs/common';
import { AppLogger } from '@logger/logger.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ConsumerService {
  private transporter;

  constructor(private readonly logger: AppLogger) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: "arif.smtp.mail.producer@gmail.com",
        pass: "rpkp leen xknu sqxd",
      },
    });
  }

  async process(event: any) {
    try {
      // Validasi event
      if (!event || typeof event !== 'object') {
        this.logger.warn('Received invalid event payload', event);
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

      const customerEmail = "untukdummy687@gmail.com";
      const items = Array.isArray(itemId) ? itemId : [itemId];

      // Kirim email
      const mailOptions = {
        from: `"Admin Multi Power Group" "arif.smtp.mail.producer@gmail.com"`,
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