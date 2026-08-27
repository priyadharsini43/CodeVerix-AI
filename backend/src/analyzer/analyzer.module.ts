import { Module } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [AIModule],
  providers: [AnalyzerService],
  exports: [AnalyzerService],
})
export class AnalyzerModule {}
