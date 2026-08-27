import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { AnalyzeSubmissionDto } from './dto/analyze-submission.dto';
import { UniversalPromptDto } from './dto/universal-prompt.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post('analyze')
  async analyze(
    @CurrentUser() user: UserPayload,
    @Body() dto: AnalyzeSubmissionDto,
  ) {
    return this.submissionsService.analyzeAndSave(user.userId, dto);
  }

  @Post('prompt')
  async processPrompt(
    @CurrentUser() user: UserPayload,
    @Body() dto: UniversalPromptDto,
  ) {
    return this.submissionsService.processUniversalPrompt(user.userId, dto);
  }

  @Get()
  async getSubmissions(
    @CurrentUser() user: UserPayload,
    @Query('projectId') projectId?: string,
  ) {
    return this.submissionsService.getSubmissionsForUser(user.userId, projectId);
  }

  @Get(':id')
  async getSubmissionById(
    @CurrentUser() user: UserPayload,
    @Param('id') submissionId: string,
  ) {
    return this.submissionsService.getSubmissionById(user.userId, submissionId);
  }
}
