import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { AI_PROVIDER, AIProvider, AnalysisResult, PromptResult } from '../ai/ai-provider.interface';
import { SUPPORTED_LANGUAGES } from '../projects/dto/create-project.dto';

const MAX_CODE_BYTES = 50 * 1024; // 50KB limit

export function normalizeLanguageName(lang: string): string {
  if (!lang) return 'Python';
  const l = lang.trim().toLowerCase();
  if (l === 'python' || l === 'py') return 'Python';
  if (l === 'java') return 'Java';
  if (l === 'c') return 'C';
  if (l === 'cpp' || l === 'c++') return 'C++';
  if (l === 'javascript' || l === 'js') return 'JavaScript';
  if (l === 'typescript' || l === 'ts') return 'TypeScript';

  const match = SUPPORTED_LANGUAGES.find((sl) => sl.toLowerCase() === l);
  return match || lang;
}

@Injectable()
export class AnalyzerService {
  constructor(
    @Inject(AI_PROVIDER) private aiProvider: AIProvider,
  ) {}

  validateCodeSubmission(language: string, sourceCode: string): string {
    if (!sourceCode || sourceCode.trim().length === 0) {
      throw new BadRequestException('Source code cannot be empty.');
    }

    if (Buffer.byteLength(sourceCode, 'utf8') > MAX_CODE_BYTES) {
      throw new BadRequestException('Source code exceeds maximum size limit of 50KB.');
    }

    const normalizedLang = normalizeLanguageName(language);
    const isSupported = SUPPORTED_LANGUAGES.some(
      (l) => l.toLowerCase() === normalizedLang.toLowerCase(),
    );

    if (!isSupported) {
      throw new BadRequestException(
        `Unsupported programming language '${language}'. Supported languages are: ${SUPPORTED_LANGUAGES.join(', ')}`,
      );
    }

    return normalizedLang;
  }

  async analyze(language: string, sourceCode: string): Promise<AnalysisResult> {
    const normalizedLang = this.validateCodeSubmission(language, sourceCode);
    return this.aiProvider.analyzeCode({ language: normalizedLang, sourceCode });
  }

  async processUniversalPrompt(prompt: string, language: string, sourceCode?: string): Promise<PromptResult> {
    if (sourceCode && sourceCode.trim().length > 0) {
      if (Buffer.byteLength(sourceCode, 'utf8') > MAX_CODE_BYTES) {
        throw new BadRequestException('Source code exceeds maximum size limit of 50KB.');
      }
    }

    const normalizedLang = normalizeLanguageName(language);
    const isSupported = SUPPORTED_LANGUAGES.some(
      (l) => l.toLowerCase() === normalizedLang.toLowerCase(),
    );

    if (!isSupported) {
      throw new BadRequestException(
        `Unsupported programming language '${language}'. Supported languages are: ${SUPPORTED_LANGUAGES.join(', ')}`,
      );
    }

    return this.aiProvider.processPrompt({ prompt, language: normalizedLang, sourceCode });
  }
}
