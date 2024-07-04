import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(passport.initialize());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  app.enableCors({
    origin: ['http://localhost:4200'], // Orígenes permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: true, // Permitir cookies y autenticación HTTP
    allowedHeaders: 'Content-Type, Accept, Authorization', // Encabezados permitidos
    exposedHeaders: 'Authorization', // Encabezados expuestos
  });

  await app.listen(3000);
}
bootstrap();
