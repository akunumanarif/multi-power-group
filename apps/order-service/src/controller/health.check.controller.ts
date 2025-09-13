import { Controller, Get, Logger } from '@nestjs/common';

@Controller('health')
export class HealthCheckController {
  private readonly logger = new Logger(HealthCheckController.name);

  @Get()
  findAll(): string {
    this.logger.log('Health check endpoint accessed');
    this.logger.debug('Debug information for health check');
    
    return 'Health check ... ';
  }
}