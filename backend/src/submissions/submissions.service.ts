import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyzerService } from '../analyzer/analyzer.service';
import { ProjectsService } from '../projects/projects.service';
import { AnalyzeSubmissionDto } from './dto/analyze-submission.dto';
import { UniversalPromptDto } from './dto/universal-prompt.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService,
    private analyzerService: AnalyzerService,
  ) {}

  async analyzeAndSave(userId: string, dto: AnalyzeSubmissionDto) {
    // 1. Verify project ownership
    await this.projectsService.findOneForUser(userId, dto.projectId);

    // 2. Validate code size and language
    this.analyzerService.validateCodeSubmission(dto.language, dto.sourceCode);

    // 3. Create Submission record
    const submission = await this.prisma.submission.create({
      data: {
        projectId: dto.projectId,
        language: dto.language,
        sourceCode: dto.sourceCode,
      },
    });

    // 4. Run AI Analysis via Gemini Provider
    const aiResult = await this.analyzerService.analyze(dto.language, dto.sourceCode);

    // 5. Store Analysis record in DB
    const analysis = await this.prisma.analysis.create({
      data: {
        submissionId: submission.id,
        status: aiResult.status,
        bugs: aiResult.bugs as any,
        explanation: aiResult.explanation,
        fixedCode: aiResult.fixedCode ?? null,
        complexity: aiResult.complexity ? (aiResult.complexity as any) : null,
        confidence: aiResult.confidence,
      },
    });

    return {
      submissionId: submission.id,
      projectId: submission.projectId,
      language: submission.language,
      sourceCode: submission.sourceCode,
      createdAt: submission.createdAt,
      analysis: {
        id: analysis.id,
        status: analysis.status,
        bugs: analysis.bugs,
        explanation: analysis.explanation,
        fixedCode: analysis.fixedCode,
        complexity: analysis.complexity,
        confidence: analysis.confidence,
        createdAt: analysis.createdAt,
      },
    };
  }

  async getSubmissionsForUser(userId: string, projectId?: string) {
    return this.prisma.submission.findMany({
      where: {
        project: {
          userId,
          ...(projectId ? { id: projectId } : {}),
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        project: {
          select: { id: true, name: true, defaultLanguage: true },
        },
        analysis: true,
      },
    });
  }

  async getSubmissionById(userId: string, submissionId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        project: true,
        analysis: true,
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission '${submissionId}' not found.`);
    }

    if (submission.project.userId !== userId) {
      throw new ForbiddenException('Access denied. You do not own this submission.');
    }

    return submission;
  }

  async processUniversalPrompt(userId: string, dto: UniversalPromptDto) {
    // 1. Verify project ownership
    await this.projectsService.findOneForUser(userId, dto.projectId);

    // 2. Run Universal AI Prompt
    const aiResult = await this.analyzerService.processUniversalPrompt(
      dto.prompt,
      dto.language,
      dto.sourceCode,
    );

    return aiResult;
  }
}
