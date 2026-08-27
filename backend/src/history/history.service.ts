import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async getUserDashboardStats(userId: string) {
    const totalProjects = await this.prisma.project.count({
      where: { userId },
    });

    const totalSubmissions = await this.prisma.submission.count({
      where: {
        project: { userId },
      },
    });

    const aiFixes = await this.prisma.analysis.count({
      where: {
        status: 'bug_found',
        submission: {
          project: { userId },
        },
      },
    });

    const recentProjects = await this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        _count: { select: { submissions: true } },
      },
    });

    const recentSubmissions = await this.prisma.submission.findMany({
      where: {
        project: { userId },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        project: { select: { id: true, name: true, defaultLanguage: true } },
        analysis: true,
      },
    });

    return {
      stats: {
        projectsCount: totalProjects,
        submissionsCount: totalSubmissions,
        aiFixesCount: aiFixes,
      },
      recentProjects,
      recentSubmissions,
    };
  }
}
