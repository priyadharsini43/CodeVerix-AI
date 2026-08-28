import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { RunAssessmentDto } from './dto/run-assessment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';

@Controller('assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get()
  async getAllAssessments(@CurrentUser() user: UserPayload) {
    return this.assessmentsService.getAllAssessments(user?.userId);
  }

  @Get(':id')
  async getAssessmentById(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.assessmentsService.getAssessmentById(user.userId, id);
  }

  @Post()
  async createAssessment(@Body() dto: CreateAssessmentDto) {
    return this.assessmentsService.createAssessment(dto);
  }

  @Post(':id/run')
  async runAssessment(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: RunAssessmentDto,
  ) {
    return this.assessmentsService.runAssessment(id, user.userId, dto);
  }

  @Post(':id/submit')
  async submitAssessment(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: RunAssessmentDto,
  ) {
    return this.assessmentsService.submitAssessment(id, user.userId, dto);
  }
}
