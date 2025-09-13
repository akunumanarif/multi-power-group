import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

@Injectable()
export class AppLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    // Pastikan menulis ke file yang dimonitor Filebeat
    this.logger = winston.createLogger({
      transports: [
        // 1. Console transport (tetap ada)
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
          ),
        }),
        
        // 2. File transport - INI YANG PENTING!
        new winston.transports.File({
          filename: '/app/logs/app.log', // Path yang sama dengan Filebeat
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json() // Format JSON
          ),
        }),
        
        // 3. Opsional: Masih bisa langsung ke ES jika mau
        // new ElasticsearchTransport({
        //   level: 'info',
        //   clientOpts: { node: 'http://elasticsearch:9200' },
        //   indexPrefix: 'nestjs-logs-direct',
        // }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}