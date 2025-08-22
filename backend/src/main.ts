import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // Global validation pipe
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

  // CORS configuration
  app.enableCors({
    origin: configService.get('NEWSHUB_FRONTEND_URL', 'http://localhost:5173'),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  
  console.log(`🚀 NewsHub Backend is running on: http://localhost:${port}/api`);
}

bootstrap();
