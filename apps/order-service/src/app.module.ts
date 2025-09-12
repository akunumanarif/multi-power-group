import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from '@ordersModule/order.module';
import { Order } from '@ordersEntity/order.entity';
import * as crypto from 'crypto';
import { AppLogger } from '@logger/logger.service';

if (!(global as any).crypto) {
  (global as any).crypto = {
    randomUUID: crypto.randomUUID,
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        
        return {
          type: 'postgres',
          host: config.get<string>('DATABASE_HOST', 'postgres'),
          port: config.get<number>('DATABASE_PORT', 5432),
          username: config.get<string>('DATABASE_USER', 'postgres'),
          password: config.get<string>('DATABASE_PASSWORD', 'postgres'),
          database: config.get<string>('DATABASE_NAME', 'order_db'),
          entities: [Order],
          synchronize: config.get<boolean>('DB_SYNCHRONIZE', true),
          logging: true,
          retryAttempts: 10,
          retryDelay: 3000,
          autoLoadEntities: true,
        };
      },
    }),
    OrdersModule,
  ],
  providers: [AppLogger], 
})
export class AppModule {}