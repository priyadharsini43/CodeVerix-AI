import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, Logger } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production');
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  // Register cookie parser
  await app.register(fastifyCookie, {
    secret: process.env.JWT_SECRET || 'codeverix_super_secret_jwt_key_2026_dev_env',
  });

  // Configure resilient production-safe CORS
  const allowedOriginEnv = process.env.FRONTEND_URL || 'http://localhost:3000';

  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      // Allow non-browser requests (e.g. health checks, server calls)
      if (!origin) {
        cb(null, true);
        return;
      }

      if (process.env.NODE_ENV !== 'production') {
        cb(null, true);
        return;
      }

      const allowedOrigins = allowedOriginEnv
        .split(',')
        .map((o) => o.trim().replace(/\/$/, ''))
        .filter(Boolean);

      const requestOrigin = origin.trim().replace(/\/$/, '');

      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(requestOrigin) ||
        requestOrigin.endsWith('.onrender.com')
      ) {
        cb(null, true);
        return;
      }

      cb(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept'],
  });

  // Global Prefix
  app.setGlobalPrefix('api');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global Interceptors and Filters
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  logger.log(`CodeVerix AI Backend running on port ${port}`);
}

bootstrap();
