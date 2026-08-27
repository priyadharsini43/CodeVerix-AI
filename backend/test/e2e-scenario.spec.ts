import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('End-to-End Scenario Test (Day 1 Flow)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    const fastifyApp = app as unknown as NestFastifyApplication;
    await fastifyApp.register(fastifyCookie, { secret: 'test_secret' });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should run end-to-end flow: database connection and model query readiness', async () => {
    expect(prisma).toBeDefined();
    const count = await prisma.user.count();
    expect(typeof count).toBe('number');
  });
});
