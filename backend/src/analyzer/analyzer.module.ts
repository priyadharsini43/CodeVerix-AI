import { Module } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { SyntaxValidatorService } from './syntax-validator.service';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [AIModule],
  providers: [AnalyzerService, SyntaxValidatorService],
  exports: [AnalyzerService, SyntaxValidatorService],
})
export class AnalyzerModule {}
