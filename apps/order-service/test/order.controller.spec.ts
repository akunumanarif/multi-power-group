import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../src/controller/order.controller';
import { OrdersService } from '@ordersService/order.service';
import { CreateOrderDto } from '@ordersDto/create.order.dto';
import { HttpException } from '@nestjs/common';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should create an order and return success response', async () => {
    const dto: CreateOrderDto = { itemId: ['item1', 'item2'] } as any;
    const mockOrder = {
      id: 1,
      orderId: 'order-001',
      internalId: 'internal-123',
      createdAt: new Date(),
      itemId: ['item1', 'item2'],
    };
    jest.spyOn(service, 'create').mockResolvedValue(mockOrder);

    const result = await controller.create(dto);
    expect(result).toEqual({
      success: true,
      data: mockOrder,
      message: 'Order created and event sent to queue',
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should throw HttpException on error', async () => {
    const dto: CreateOrderDto = { /* mock properties */ } as any;
    jest.spyOn(service, 'create').mockRejectedValue(new Error('DB error'));

    await expect(controller.create(dto)).rejects.toThrow(HttpException);
  });
});
