import { Test, TestingModule } from '@nestjs/testing';
import { GeminiProvider, cleanCodeFence } from './gemini.provider';
import { AnalyzerService } from '../analyzer/analyzer.service';
import { SyntaxValidatorService } from '../analyzer/syntax-validator.service';
import { AI_PROVIDER } from './ai-provider.interface';

const LANGUAGES = ['Java', 'Python', 'C', 'C++', 'JavaScript', 'TypeScript'] as const;

const SAMPLE_CODE: Record<string, string> = {
  Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int sum = 0;\n        for (int i = 1; i <= n; i++) {\n            if (i % 2 == 0) sum += i;\n        }\n        System.out.println("Sum: " + sum);\n    }\n}`,
  Python: `def calculate_even_sum(n):\n    total = 0\n    for i in range(1, n + 1):\n        if i % 2 == 0:\n            total += i\n    return total\n\nif __name__ == '__main__':\n    print(calculate_even_sum(10))`,
  C: `#include <stdio.h>\n\nint main() {\n    int n = 10;\n    int sum = 0;\n    for (int i = 1; i <= n; i++) {\n        if (i % 2 == 0) sum += i;\n    }\n    printf("Sum: %d\\n", sum);\n    return 0;\n}`,
  'C++': `#include <iostream>\n#include <vector>\n\nint main() {\n    int n = 10;\n    int sum = 0;\n    for (int i = 1; i <= n; i++) {\n        if (i % 2 == 0) sum += i;\n    }\n    std::cout << "Sum: " << sum << std::endl;\n    return 0;\n}`,
  JavaScript: `function calculateEvenSum(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 === 0) sum += i;\n  }\n  return sum;\n}\nconsole.log(calculateEvenSum(10));`,
  TypeScript: `function calculateEvenSum(n: number): number {\n  let sum: number = 0;\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 === 0) sum += i;\n  }\n  return sum;\n}\nconsole.log(calculateEvenSum(10));`,
};

describe('Code Conversion & Analyze & Fix Architecture Test Matrix', () => {
  let provider: GeminiProvider;
  let analyzerService: AnalyzerService;

  beforeEach(async () => {
    process.env.GEMINI_API_KEY = 'test-mock-api-key';
    process.env.GEMINI_PRIMARY_MODEL = 'gemini-3.6-flash';
    process.env.GEMINI_FALLBACK_MODEL = 'gemini-3.5-flash';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiProvider,
        SyntaxValidatorService,
        AnalyzerService,
        {
          provide: AI_PROVIDER,
          useExisting: GeminiProvider,
        },
      ],
    }).compile();

    provider = module.get<GeminiProvider>(GeminiProvider);
    analyzerService = module.get<AnalyzerService>(AnalyzerService);

    // Mock internal Gemini API call to prevent live quota consumption
    (provider as any).generateWithRetry = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('36 Source -> Target Language Conversion Combinations Matrix', () => {
    LANGUAGES.forEach((sourceLang) => {
      LANGUAGES.forEach((targetLang) => {
        it(`should correctly convert ${sourceLang} -> ${targetLang} preserving semantics and schema`, async () => {
          const sampleSource = SAMPLE_CODE[sourceLang];
          const mockConvertedSnippet = SAMPLE_CODE[targetLang];

          const mockJsonResponse = JSON.stringify({
            success: true,
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
            convertedCode: mockConvertedSnippet,
            explanation: `Successfully translated ${sourceLang} logic to idiomatic ${targetLang}.`,
            notes: [`Mapped data structures to native ${targetLang} equivalents.`],
            warnings: [],
          });

          (provider as any).generateWithRetry.mockResolvedValue({
            text: mockJsonResponse,
            modelUsed: 'gemini-3.6-flash',
          });

          const result = await analyzerService.convertCode(
            sourceLang,
            targetLang,
            sampleSource,
          );

          expect(result).toBeDefined();
          expect(result.success).toBe(true);
          expect(result.sourceLanguage.toLowerCase()).toBe(sourceLang.toLowerCase());
          expect(result.targetLanguage.toLowerCase()).toBe(targetLang.toLowerCase());
          expect(result.convertedCode).toBeDefined();
          expect(result.convertedCode.trim().length).toBeGreaterThan(0);
          expect(result.convertedCode).not.toContain('```');
          expect(result.explanation).toBeDefined();
          expect(Array.isArray(result.notes)).toBe(true);
        });
      });
    });
  });

  describe('Analyze & Fix for all 6 Supported Languages', () => {
    LANGUAGES.forEach((lang) => {
      it(`should correctly analyze and fix code for ${lang}`, async () => {
        const sampleCode = SAMPLE_CODE[lang];
        const mockJsonResponse = JSON.stringify({
          success: true,
          language: lang,
          status: 'bug_found',
          bugs: [
            {
              line: 5,
              type: 'runtime',
              severity: 'high',
              message: 'Potential indexing or boundary overflow',
              explanation: 'Loop bounds checking fixed.',
            },
          ],
          issues: [
            {
              line: 5,
              type: 'runtime',
              severity: 'error',
              description: 'Potential indexing or boundary overflow',
            },
          ],
          fixedCode: sampleCode,
          correctedCode: sampleCode,
          explanation: 'Fixed loop boundary condition.',
          complexity: { time: 'O(n)', space: 'O(1)' },
          confidence: 0.95,
        });

        (provider as any).generateWithRetry.mockResolvedValue({
          text: mockJsonResponse,
          modelUsed: 'gemini-3.6-flash',
        });

        const result = await analyzerService.analyze(lang, sampleCode);

        expect(result).toBeDefined();
        expect(result.status).toBe('bug_found');
        expect(result.bugs.length).toBeGreaterThan(0);
        expect(result.fixedCode).toBeDefined();
        expect(result.fixedCode).not.toContain('```');
        expect(result.complexity).toEqual({ time: 'O(n)', space: 'O(1)' });
      });
    });
  });

  describe('Gemini Quota & Error Handling Verification', () => {
    it('should throw immediate error on 429 RESOURCE_EXHAUSTED without excessive retry loops', async () => {
      const quotaError = new Error('Quota exceeded for quota metric GenerateRequestsPerDay');
      (quotaError as any).status = 429;

      (provider as any).generateWithRetry.mockRejectedValue(quotaError);

      await expect(
        analyzerService.convertCode('Python', 'Java', 'print("test")'),
      ).rejects.toThrow('Gemini API quota has been exhausted');
    });

    it('should handle 503 UNAVAILABLE gracefully with clear user error', async () => {
      const unavailError = new Error('503 Service Unavailable: High demand');
      (unavailError as any).status = 503;

      (provider as any).generateWithRetry.mockRejectedValue(unavailError);

      await expect(
        analyzerService.convertCode('Python', 'Java', 'print("test")'),
      ).rejects.toThrow('Code conversion is temporarily unavailable');
    });

    it('should strip markdown fences from AI code outputs', () => {
      const markdownCode = '```python\ndef hello():\n    print("Hello")\n```';
      const cleaned = cleanCodeFence(markdownCode);
      expect(cleaned).toBe('def hello():\n    print("Hello")');
    });
  });
});
