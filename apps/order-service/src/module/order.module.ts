import { Module } from '@nestjs/common';
import { OrdersController } from '@ordersController/order.controller';
import { OrdersService } from '@ordersService/order.service';
import { HealthCheckController } from '@ordersController/health.check.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import { KafkaProducer } from '@kafka/kafka.producer'; 

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrdersController, HealthCheckController],
  providers: [OrdersService, KafkaProducer],   
  exports: [OrdersService],
})
export class OrdersModule {}
