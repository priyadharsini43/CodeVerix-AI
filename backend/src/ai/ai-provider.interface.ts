export const AI_PROVIDER = 'AI_PROVIDER';

export interface BugDetail {
  line?: number | null; // AI-reported line location
  type: 'syntax' | 'runtime' | 'logical' | 'type' | 'performance' | 'security';
  severity: 'high' | 'medium' | 'low';
  message: string;
  explanation: string;
}

export interface ComplexityDetail {
  time?: string;
  space?: string;
}

export interface AnalysisResult {
  language: string;
  status: 'bug_found' | 'no_bug_found' | 'analysis_failed';
  bugs: BugDetail[];
  fixedCode?: string | null;
  explanation: string;
  complexity?: ComplexityDetail | null;
  confidence: number;
}

export interface PromptResult {
  intent: 'solve' | 'fix' | 'explain' | 'optimize' | 'convert' | 'generate_tests' | 'debug' | 'review';
  language: string;
  problemExplanation?: string;
  solution?: string;
  complexity?: ComplexityDetail | null;
  testCases?: any[];
  warnings?: string[];
  learningExplanation?: string;
}

export interface AIProvider {
  analyzeCode(params: {
    language: string;
    sourceCode: string;
  }): Promise<AnalysisResult>;

  processPrompt(params: {
    prompt: string;
    language: string;
    sourceCode?: string;
  }): Promise<PromptResult>;
}
