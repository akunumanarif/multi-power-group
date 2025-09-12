import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('MPG Order Service API')
  .setDescription('API documentation for MPG Order Service')
  .setVersion('1.0')
  .addTag('orders', 'Order management endpoints')
  .addTag('health', 'Health check endpoints')
//   .addBearerAuth() // Jika ada JAuth
  .build();

export const swaggerOptions = {
  customCss: `
    .topbar { display: none }
    .swagger-ui .information-container { background-color: #fafafa; }
  `,
  customSiteTitle: 'MPG Order API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
  },
};