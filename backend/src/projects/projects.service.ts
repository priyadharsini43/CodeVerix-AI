import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        userId,
        name: createProjectDto.name,
        description: createProjectDto.description,
        defaultLanguage: createProjectDto.defaultLanguage,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });
  }

  async findOneForUser(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        submissions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { analysis: true },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID '${projectId}' not found.`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Access denied. You do not own this project.');
    }

    return project;
  }

  async updateForUser(userId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
    await this.findOneForUser(userId, projectId); // Verify ownership

    return this.prisma.project.update({
      where: { id: projectId },
      data: updateProjectDto,
    });
  }

  async deleteForUser(userId: string, projectId: string) {
    await this.findOneForUser(userId, projectId); // Verify ownership

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    return { message: 'Project deleted successfully' };
  }
}
