import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully and return user + token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-1',
        name: 'Alex Developer',
        email: 'alex@example.com',
        passwordHash: 'hashed_password',
        createdAt: new Date(),
      });

      const result = await service.register({
        name: 'Alex Developer',
        email: 'alex@example.com',
        password: 'password123',
      });

      expect(result.user.email).toEqual('alex@example.com');
      expect(result.token).toEqual('mocked_jwt_token');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email is already taken', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(
        service.register({
          name: 'Alex Developer',
          email: 'alex@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should authenticate user and return token if credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Alex Developer',
        email: 'alex@example.com',
        passwordHash: hashedPassword,
        createdAt: new Date(),
      });

      const result = await service.login({
        email: 'alex@example.com',
        password: 'password123',
      });

      expect(result.user.id).toEqual('user-1');
      expect(result.token).toEqual('mocked_jwt_token');
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'alex@example.com',
        passwordHash: hashedPassword,
      });

      await expect(
        service.login({
          email: 'alex@example.com',
          password: 'wrong_password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
