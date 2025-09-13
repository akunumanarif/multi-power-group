import { Module } from '@nestjs/common';
import { ConsumerService } from './service/consumer.service';
import { ConsumerController } from '@notificationController/notification.controller';
import { AppLogger } from '@logger/logger.service';
import { ConfigService } from './config/notification.config';


@Module({
  imports: [],
  providers: [ConsumerService, AppLogger, ConfigService],
  controllers: [ConsumerController],
  exports: [ConfigService],
})
export class ConsumerModule {}