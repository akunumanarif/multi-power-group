import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { ConsumerService } from '@notificationService/consumer.service';

@Injectable()
export class KafkaConsumer implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer;
  private brokers = process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092'];

  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    this.kafka = new Kafka({ clientId: 'notification-service', brokers: this.brokers });
    this.consumer = this.kafka.consumer({ groupId: 'notification-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'order.created', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        try {
          const payload = JSON.parse(message.value.toString());
          await this.consumerService.process(payload);
        } catch (err) {
          // log error; do not crash - allow retry (at least once)
          console.error('consumer error', err);
        }
      },
    });
  }

  async onModuleDestroy() {
    if (this.consumer) await this.consumer.disconnect();
  }
}
