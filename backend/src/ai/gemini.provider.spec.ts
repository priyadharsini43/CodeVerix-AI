import { Test, TestingModule } from '@nestjs/testing';
import { GeminiProvider } from './gemini.provider';

describe('GeminiProvider', () => {
  let provider: GeminiProvider;

  beforeEach(async () => {
    // Ensure API Key exists for the constructor/method checks
    process.env.GEMINI_API_KEY = 'test-mock-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [GeminiProvider],
    }).compile();

    provider = module.get<GeminiProvider>(GeminiProvider);

    // Mock the private generateWithRetry method to avoid absolute real API calls
    (provider as any).generateWithRetry = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('processPrompt', () => {
    it('should throw error if GEMINI_API_KEY is not set', async () => {
      process.env.GEMINI_API_KEY = '';
      await expect(
        provider.processPrompt({ prompt: 'Fix this', language: 'python' })
      ).rejects.toThrow('GEMINI_API_KEY is not configured');
    });

    it('should correctly parse the "fix" intent', async () => {
      process.env.GEMINI_API_KEY = 'test-mock-key';
      const mockJsonResponse = JSON.stringify({
        intent: 'fix',
        language: 'python',
        solution: 'def hello(): pass',
        problemExplanation: 'Syntax error fixed.',
      });

      (provider as any).generateWithRetry.mockResolvedValue({
        text: mockJsonResponse,
        modelUsed: 'mock-model',
      });

      const result = await provider.processPrompt({
        prompt: 'Fix this code',
        language: 'python',
        sourceCode: 'def hello() pass',
      });

      expect(result.intent).toBe('fix');
      expect(result.solution).toBe('def hello(): pass');
    });

    it('should correctly parse the "explain" intent', async () => {
      process.env.GEMINI_API_KEY = 'test-mock-key';
      const mockJsonResponse = JSON.stringify({
        intent: 'explain',
        language: 'java',
        learningExplanation: 'This is a public class...',
      });

      (provider as any).generateWithRetry.mockResolvedValue({
        text: mockJsonResponse,
        modelUsed: 'mock-model',
      });

      const result = await provider.processPrompt({
        prompt: 'Explain what this class does',
        language: 'java',
        sourceCode: 'public class Main {}',
      });

      expect(result.intent).toBe('explain');
      expect(result.learningExplanation).toBe('This is a public class...');
    });

    it('should correctly parse the "optimize" intent', async () => {
      process.env.GEMINI_API_KEY = 'test-mock-key';
      const mockJsonResponse = JSON.stringify({
        intent: 'optimize',
        language: 'c',
        solution: 'int main() { return 0; }',
        complexity: { time: 'O(1)', space: 'O(1)' }
      });

      (provider as any).generateWithRetry.mockResolvedValue({
        text: mockJsonResponse,
        modelUsed: 'mock-model',
      });

      const result = await provider.processPrompt({
        prompt: 'Make it faster',
        language: 'c',
        sourceCode: 'int main() { return 0; }',
      });

      expect(result.intent).toBe('optimize');
      expect(result.complexity?.time).toBe('O(1)');
    });

    it('should correctly parse the "convert" intent', async () => {
      process.env.GEMINI_API_KEY = 'test-mock-key';
      const mockJsonResponse = JSON.stringify({
        intent: 'convert',
        language: 'python',
        solution: 'print("hello")',
      });

      (provider as any).generateWithRetry.mockResolvedValue({
        text: mockJsonResponse,
        modelUsed: 'mock-model',
      });

      const result = await provider.processPrompt({
        prompt: 'Convert to Python',
        language: 'java',
        sourceCode: 'System.out.println("hello");',
      });

      expect(result.intent).toBe('convert');
      expect(result.language).toBe('python');
    });

    it('should correctly parse the "generate_tests" intent', async () => {
      process.env.GEMINI_API_KEY = 'test-mock-key';
      const mockJsonResponse = JSON.stringify({
        intent: 'generate_tests',
        language: 'javascript',
        testCases: [{ input: '1', expected: '2' }],
      });

      (provider as any).generateWithRetry.mockResolvedValue({
        text: mockJsonResponse,
        modelUsed: 'mock-model',
      });

      const result = await provider.processPrompt({
        prompt: 'Give me test cases',
        language: 'javascript',
        sourceCode: 'function add1(x) { return x + 1; }',
      });

      expect(result.intent).toBe('generate_tests');
      expect(result.testCases).toBeDefined();
      expect(result.testCases?.length).toBe(1);
    });

    it('should handle invalid Gemini response gracefully by throwing error', async () => {
      process.env.GEMINI_API_KEY = 'test-mock-key';
      
      (provider as any).generateWithRetry.mockResolvedValue({
        text: 'Not a JSON',
        modelUsed: 'mock-model',
      });

      await expect(
        provider.processPrompt({ prompt: 'Fix this', language: 'python' })
      ).rejects.toThrow();
    });
  });
});
