import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Security - Helmet
  app.use(helmet());
  
  // CORS
  app.enableCors({
    origin: configService.get<string>('cors.origin'),
    credentials: true,
  });
  
  // Rate Limiting
  app.use(
    rateLimit({
      windowMs: configService.get<number>('rateLimit.ttl') * 1000,
      max: configService.get<number>('rateLimit.max'),
      message: 'Too many requests from this IP, please try again later.',
    }),
  );
  
  // Global prefix
  app.setGlobalPrefix(configService.get<string>('server.apiPrefix'));
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Swagger (API Documentation)
  // Can be enabled in development
  
  const port = configService.get<number>('server.port');
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
