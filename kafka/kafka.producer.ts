// kafka.producer.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;

  constructor() {
    // Gunakan environment variable untuk broker address
    const kafkaBroker = process.env.KAFKA_BROKER || 'kafka:9092';
    
    const kafka = new Kafka({
      clientId: 'order-service',
      brokers: [kafkaBroker],
      retry: {
        initialRetryTime: 100,
        retries: 10
      }
    });

    this.producer = kafka.producer();
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      console.log('Kafka Producer connected successfully');
    } catch (error) {
      console.error('Failed to connect to Kafka:', error);
      // Jangan throw error, biarkan service tetap running
      // Kafka connection akan di-retry secara background
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
    } catch (error) {
      console.error('Error disconnecting Kafka producer:', error);
    }
  }

  async send(topic: string, message: any) {
    try {
      const record: ProducerRecord = {
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      };

      await this.producer.send(record);
      console.log('Message sent to Kafka:', { topic, messageId: message.id });
    } catch (error) {
      console.error('Failed to send message to Kafka:', error);
      throw error;
    }
  }
}