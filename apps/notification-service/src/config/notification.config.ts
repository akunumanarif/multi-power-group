// apps/notification-service/src/config/notification.config.ts
import * as dotenv from 'dotenv';
import * as path from 'path';

export class ConfigService {
  constructor() {
    
    // Coba beberapa path
    const envPaths = [
      path.resolve(__dirname, '../../../../.env'), 
      path.resolve(__dirname, '../../../.env'),    
      path.resolve(process.cwd(), '.env'),         
      path.resolve(process.cwd(), '../../.env'),   
    ];

    let envLoaded = false;
    for (const envPath of envPaths) {
      try {
        const result = dotenv.config({ path: envPath });
        if (!result.error) {
          console.log('Successfully loaded .env from:', envPath);
          envLoaded = true;
          
          // Debug: Check if variables are loaded
          console.log('EMAIL_USER:', process.env.EMAIL_USER ? '***SET***' : 'NOT SET');
          console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');
          console.log('EMAIL_CLIENT1:', process.env.EMAIL_CLIENT1 ? '***SET***' : 'NOT SET');
          break;
        }
      } catch (error) {
        console.log('Failed to load .env from:', envPath);
      }
    }

    if (!envLoaded) {
      console.error('Could not load .env file from any path');
    }
  }

  getEmailConfig() {
    return {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
      client_one: process.env.EMAIL_CLIENT1,
    };
  }

  getKafkaConfig() {
    return {
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
    };
  }
}