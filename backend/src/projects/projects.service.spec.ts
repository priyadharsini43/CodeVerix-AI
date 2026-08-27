import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prismaService: any;

  const mockPrismaService = {
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prismaService = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a project for authenticated user', async () => {
      const mockProject = {
        id: 'proj-1',
        userId: 'user-1',
        name: 'Python Debugging',
        defaultLanguage: 'Python',
      };
      mockPrismaService.project.create.mockResolvedValue(mockProject);

      const result = await service.create('user-1', {
        name: 'Python Debugging',
        defaultLanguage: 'Python',
      });

      expect(result).toEqual(mockProject);
      expect(mockPrismaService.project.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          name: 'Python Debugging',
          description: undefined,
          defaultLanguage: 'Python',
        },
      });
    });
  });

  describe('findOneForUser (Authorization check)', () => {
    it('should return project if owned by requesting user', async () => {
      const mockProject = {
        id: 'proj-1',
        userId: 'user-1',
        name: 'My Project',
      };
      mockPrismaService.project.findUnique.mockResolvedValue(mockProject);

      const result = await service.findOneForUser('user-1', 'proj-1');
      expect(result).toEqual(mockProject);
    });

    it('should throw ForbiddenException if project belongs to another user', async () => {
      const mockProject = {
        id: 'proj-1',
        userId: 'other-user-id',
        name: 'Other User Project',
      };
      mockPrismaService.project.findUnique.mockResolvedValue(mockProject);

      await expect(
        service.findOneForUser('user-1', 'proj-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if project does not exist', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null);

      await expect(
        service.findOneForUser('user-1', 'nonexistent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
