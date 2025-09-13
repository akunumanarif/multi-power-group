import { Controller, Post, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { OrdersService } from '@ordersService/order.service';
import { CreateOrderDto } from '@ordersDto/create.order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(202)
  async create(@Body() dto: CreateOrderDto) {
    try {
      const order = await this.ordersService.create(dto);
      return {
        success: true,
        data: order,
        message: 'Order created and event sent to queue'
      };
    } catch (error) {
      if (error.message?.includes('Duplicate order:')) {
        throw new HttpException(
          `Failed to create order: ${error.message}`,
          HttpStatus.CONFLICT
        );
      }
      if (
        error.message?.includes('Bad Request') ||
        error instanceof SyntaxError ||
        error.status === 400 ||
        error.message?.includes('violates not-null constraint')
      ) {
        throw new HttpException(
          `Failed to create order: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        `Failed to create order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}