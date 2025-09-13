import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { ConsumerService } from '@notificationService/consumer.service';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @EventPattern('order-created')
  async handleOrderCreated(@Payload() message: any, @Ctx() context: KafkaContext) {
    try {
      if (!message) {
        console.warn('Received empty message');
        return;
      }

      // Log untuk debugging
      console.log('Received message:', JSON.stringify(message, null, 2));
      
      await this.consumerService.process(message);
    } catch (error) {
      console.error('Error processing order-created event:', error);
    }
  }
}