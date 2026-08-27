import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { ProjectsModule } from '../projects/projects.module';
import { AnalyzerModule } from '../analyzer/analyzer.module';

@Module({
  imports: [ProjectsModule, AnalyzerModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
