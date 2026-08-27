import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzerService } from './analyzer.service';
import { AI_PROVIDER, AIProvider } from '../ai/ai-provider.interface';
import { BadRequestException } from '@nestjs/common';

describe('AnalyzerService', () => {
  let service: AnalyzerService;
  let aiProvider: AIProvider;

  const mockAiProvider = {
    analyzeCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyzerService,
        { provide: AI_PROVIDER, useValue: mockAiProvider },
      ],
    }).compile();

    service = module.get<AnalyzerService>(AnalyzerService);
    aiProvider = module.get(AI_PROVIDER);
    jest.clearAllMocks();
  });

  describe('validateCodeSubmission', () => {
    it('should throw BadRequestException if source code is empty', () => {
      expect(() =>
        service.validateCodeSubmission('Python', '  '),
      ).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if language is unsupported', () => {
      expect(() =>
        service.validateCodeSubmission('Haskell', 'print "hello"'),
      ).toThrow(BadRequestException);
    });

    it('should accept valid supported language and non-empty code', () => {
      expect(() =>
        service.validateCodeSubmission('Python', 'print("hello")'),
      ).not.toThrow();
    });
  });

  describe('analyze', () => {
    it('should return AI analysis result', async () => {
      const mockResult = {
        language: 'Python',
        status: 'bug_found' as const,
        bugs: [
          {
            line: 3,
            type: 'runtime' as const,
            severity: 'high' as const,
            message: 'Division by zero',
            explanation: 'The divisor can be zero.',
          },
        ],
        fixedCode: 'def avg(nums):\n return sum(nums)/len(nums) if nums else 0',
        explanation: 'Added empty array check.',
        complexity: { time: 'O(n)', space: 'O(1)' },
        confidence: 0.95,
      };

      mockAiProvider.analyzeCode.mockResolvedValue(mockResult);

      const result = await service.analyze('Python', 'def avg(nums): return sum(nums)/len(nums)');
      expect(result).toEqual(mockResult);
      expect(mockAiProvider.analyzeCode).toHaveBeenCalledWith({
        language: 'Python',
        sourceCode: 'def avg(nums): return sum(nums)/len(nums)',
      });
    });
  });
});
