import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerController } from '@notificationController/notification.controller';
import { ConsumerService } from '@notificationService/consumer.service';
import { KafkaContext } from '@nestjs/microservices';

// Mock console.error untuk test error logging
const originalConsoleError = console.error;
const mockConsoleError = jest.fn();

const mockConsumerService = {
  process: jest.fn(),
};

const mockKafkaContext = {
  getTopic: jest.fn(),
  getPartition: jest.fn(),
  getMessage: jest.fn(),
} as unknown as KafkaContext;

describe('ConsumerController', () => {
  let controller: ConsumerController;

  beforeEach(async () => {
    // Mock console.error sebelum setiap test
    console.error = mockConsoleError;
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumerController],
      providers: [
        { provide: ConsumerService, useValue: mockConsumerService },
      ],
    }).compile();

    controller = module.get<ConsumerController>(ConsumerController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original console.error setelah semua test
    console.error = originalConsoleError;
  });

  describe('handleOrderCreated', () => {
    it('should process valid message with context', async () => {
      const message = {
        id: '1',
        orderId: 'ORDER-001',
        itemId: ['item1', 'item2'],
        createdAt: new Date().toISOString(),
      };

      await controller.handleOrderCreated(message, mockKafkaContext);

      expect(mockConsumerService.process).toHaveBeenCalledWith(message);
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle empty message with context', async () => {
      await controller.handleOrderCreated(null, mockKafkaContext);

      expect(mockConsumerService.process).not.toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle processing error with context and log it', async () => {
      const message = { orderId: 'ORDER-001' };
      const error = new Error('Processing failed');
      
      mockConsumerService.process.mockRejectedValueOnce(error);

      await controller.handleOrderCreated(message, mockKafkaContext);

      expect(mockConsumerService.process).toHaveBeenCalledWith(message);
      
      // Verify that error was logged
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error processing order-created event:',
        error
      );
    });

    it('should log error when service throws unexpected error', async () => {
      const message = { orderId: 'ORDER-001' };
      const error = new TypeError('Unexpected error');
      
      mockConsumerService.process.mockRejectedValueOnce(error);

      await controller.handleOrderCreated(message, mockKafkaContext);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error processing order-created event:',
        error
      );
    });
  });
});