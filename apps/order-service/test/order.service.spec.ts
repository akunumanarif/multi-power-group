import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../src/service/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../src/entity/order.entity';
import { CreateOrderDto } from '../src/dto/create.order.dto';
import { KafkaProducer } from '@kafka/kafka.producer';

const mockOrderRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

const mockKafkaProducer = () => ({
  send: jest.fn(),
});

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: any;
  let kafkaProducer: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useFactory: mockOrderRepository },
        { provide: KafkaProducer, useFactory: mockKafkaProducer },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get(getRepositoryToken(Order));
    kafkaProducer = module.get<KafkaProducer>(KafkaProducer);
  });

  it('should save order and send event to Kafka', async () => {
    const dto: CreateOrderDto = { itemId: ['item1', 'item2'] } as any;
    const mockOrder = { ...dto };
    const savedOrder = {
      id: 1,
      orderId: 'order-001',
      internalId: 'internal-123',
      createdAt: new Date(),
      itemId: ['item1', 'item2'],
    };
    orderRepository.create.mockReturnValue(mockOrder);
    orderRepository.save.mockResolvedValue(savedOrder);
    kafkaProducer.send.mockResolvedValue(true);

    const result = await service.create(dto);
    expect(orderRepository.create).toHaveBeenCalledWith(dto);
    expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    expect(kafkaProducer.send).toHaveBeenCalledWith('order-created', expect.objectContaining({
      id: savedOrder.orderId,
      itemId: savedOrder.itemId,
      createdAt: expect.any(Date),
    }));
    expect(result).toBe(savedOrder);
  });

  it('should save order and log error if Kafka fails', async () => {
    const dto: CreateOrderDto = { itemId: ['item1'] } as any;
    const mockOrder = { ...dto };
    const savedOrder = {
      id: 2,
      orderId: 'order-002',
      internalId: 'internal-456',
      createdAt: new Date(),
      itemId: ['item1'],
    };
    orderRepository.create.mockReturnValue(mockOrder);
    orderRepository.save.mockResolvedValue(savedOrder);
    kafkaProducer.send.mockRejectedValue(new Error('Kafka error'));

    const result = await service.create(dto);
    expect(orderRepository.create).toHaveBeenCalledWith(dto);
    expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    expect(kafkaProducer.send).toHaveBeenCalled();
    expect(result).toBe(savedOrder);
  });
});
