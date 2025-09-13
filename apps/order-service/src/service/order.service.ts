// orders.service.ts
import { Injectable, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { CreateOrderDto } from '../dto/create.order.dto';
import { KafkaProducer } from '@kafka/kafka.producer';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @Inject(KafkaProducer)
    private kafkaProducer: KafkaProducer,
  ) {}

  async create(dto: CreateOrderDto) {
    try {
      // 1. Simpan order ke database
      const order = this.orderRepository.create(dto);
      const savedOrder = await this.orderRepository.save(order);

      this.logger.log(`Order saved to database: ${savedOrder.orderId}`);

      // 2. Coba kirim event ke Kafka (jika Kafka available)
      try {
        await this.kafkaProducer.send('order-created', {
          id: savedOrder.orderId,
          ...dto,
          createdAt: new Date(),
        });
        this.logger.log(`Order event sent to Kafka: ${savedOrder.orderId}`);
      } catch (error) {
        this.logger.error(`Failed to send order event to Kafka: ${error.message}`);
        // Jangan throw error, biarkan order tetap tersimpan di database
      }

      return savedOrder;
    } catch (error) {
      this.logger.error(`Order creation error: ${error.message}`);
      this.logger.error(`Order creation error (full):`, error);
      if (
        error.message?.includes('duplicate key value violates unique constraint')
      ) {
        throw new HttpException(
          `Duplicate order: ${error.message}`,
          HttpStatus.CONFLICT
        );
      }
      throw error;
    }
  }
}