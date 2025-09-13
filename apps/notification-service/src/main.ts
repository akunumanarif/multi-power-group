import { NestFactory } from '@nestjs/core';
import { ConsumerModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'notification-consumer-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
