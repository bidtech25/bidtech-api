import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const config = app.get(ConfigService);

  // Global prefix
  const apiPrefix = config.get('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: true, // Allow all origins for now to fix connectivity issues
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      // Remove props não declaradas
      forbidNonWhitelisted: true, // Retorna erro se props extras
      transform: true,      // Transforma tipos automaticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BidTech API')
    .setDescription('API de Mapeamento de Processos com IA')
    .setVersion('2.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Token JWT do Supabase',
    })
    .addServer(`http://localhost:${config.get('PORT')}`, 'Development')
    .addServer('https://bidtech-bidtech-api.judbsq.easypanel.host', 'Easypanel')
    .addServer('https://api.bidtech.com.br', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = config.get('PORT', 3000);
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 Swagger docs: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
