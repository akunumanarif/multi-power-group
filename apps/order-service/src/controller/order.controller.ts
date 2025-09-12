import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from '@ordersService/order.service';
import { CreateOrderDto } from '@ordersDto/create.order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    try {
      const order = await this.ordersService.create(dto);
      return {
        success: true,
        data: order,
        message: 'Order created and event sent to queue'
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}