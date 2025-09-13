import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerService } from '@notificationService/consumer.service';
import { AppLogger } from '@logger/logger.service';

// Mock untuk nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    verify: jest.fn(),
    sendMail: jest.fn(),
  }),
}));

// Mock untuk logger
const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

describe('ConsumerService', () => {
  let service: ConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumerService,
        { provide: AppLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ConsumerService>(ConsumerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('process', () => {
    it('should send email for valid event', async () => {
      const event = {
        id: '1',
        orderId: 'ORDER-001',
        itemId: ['item1', 'item2'],
        createdAt: new Date().toISOString(),
      };

      await service.process(event);

      expect(mockLogger.log).toHaveBeenCalledWith(
        expect.stringContaining('Processing event'),
        expect.any(String)
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        expect.stringContaining('Email sent for orderId=ORDER-001'),
        expect.any(String)
      );
    });

    it('should handle invalid event', async () => {
      await service.process(null);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Received invalid event payload',
        null
      );
    });

    it('should handle missing transporter', async () => {
      // Simulate transporter not initialized
      (service as any).transporter = null;
      const event = { orderId: 'ORDER-001', itemId: ['item1'] };

      await service.process(event);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Email transporter not initialized'
      );
    });
  });
});