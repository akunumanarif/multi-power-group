import { Module } from '@nestjs/common';
import { ConsumerService } from './service/consumer.service';
import { ConsumerController } from '@notificationController/notification.controller';
import { AppLogger } from '@logger/logger.service';

@Module({
  imports: [],
  providers: [ConsumerService, AppLogger],
  controllers: [ConsumerController],
})
export class ConsumerModule {}