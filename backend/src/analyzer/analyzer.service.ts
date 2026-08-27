import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { AI_PROVIDER, AIProvider, AnalysisResult, PromptResult } from '../ai/ai-provider.interface';
import { SUPPORTED_LANGUAGES } from '../projects/dto/create-project.dto';

const MAX_CODE_BYTES = 50 * 1024; // 50KB limit

@Injectable()
export class AnalyzerService {
  constructor(
    @Inject(AI_PROVIDER) private aiProvider: AIProvider,
  ) {}

  validateCodeSubmission(language: string, sourceCode: string): void {
    if (!sourceCode || sourceCode.trim().length === 0) {
      throw new BadRequestException('Source code cannot be empty.');
    }

    if (Buffer.byteLength(sourceCode, 'utf8') > MAX_CODE_BYTES) {
      throw new BadRequestException('Source code exceeds maximum size limit of 50KB.');
    }

    const normalizedLang = language.trim();
    const isSupported = SUPPORTED_LANGUAGES.some(
      (l) => l.toLowerCase() === normalizedLang.toLowerCase(),
    );

    if (!isSupported) {
      throw new BadRequestException(
        `Unsupported programming language '${language}'. Supported languages are: ${SUPPORTED_LANGUAGES.join(', ')}`,
      );
    }
  }

  async analyze(language: string, sourceCode: string): Promise<AnalysisResult> {
    this.validateCodeSubmission(language, sourceCode);
    return this.aiProvider.analyzeCode({ language, sourceCode });
  }

  async processUniversalPrompt(prompt: string, language: string, sourceCode?: string): Promise<PromptResult> {
    if (sourceCode && sourceCode.trim().length > 0) {
      if (Buffer.byteLength(sourceCode, 'utf8') > MAX_CODE_BYTES) {
        throw new BadRequestException('Source code exceeds maximum size limit of 50KB.');
      }
    }

    const normalizedLang = language.trim();
    const isSupported = SUPPORTED_LANGUAGES.some(
      (l) => l.toLowerCase() === normalizedLang.toLowerCase(),
    );

    if (!isSupported) {
      throw new BadRequestException(
        `Unsupported programming language '${language}'. Supported languages are: ${SUPPORTED_LANGUAGES.join(', ')}`,
      );
    }

    return this.aiProvider.processPrompt({ prompt, language, sourceCode });
  }
}
