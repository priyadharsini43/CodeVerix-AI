export const AI_PROVIDER = 'AI_PROVIDER';

export interface BugDetail {
  line?: number | null; // AI-reported line location
  type: 'syntax' | 'runtime' | 'logical' | 'type' | 'performance' | 'security';
  severity: 'high' | 'medium' | 'low';
  message: string;
  explanation: string;
}

export interface AnalysisIssue {
  line?: number | null;
  type: 'syntax' | 'logic' | 'type' | 'runtime' | 'import' | 'performance' | 'security';
  severity: 'error' | 'warning' | 'high' | 'medium' | 'low';
  description: string;
}

export interface ComplexityDetail {
  time?: string;
  space?: string;
}

export interface AnalysisResult {
  success?: boolean;
  language: string;
  status: 'bug_found' | 'no_bug_found' | 'analysis_failed';
  bugs: BugDetail[];
  issues?: AnalysisIssue[];
  fixedCode?: string | null;
  correctedCode?: string | null;
  explanation: string;
  complexity?: ComplexityDetail | null;
  confidence: number;
}

export interface ConversionResult {
  success: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  convertedCode: string;
  explanation: string;
  notes?: string[];
  warnings?: string[];
}

export interface PromptResult {
  intent: 'solve' | 'fix' | 'explain' | 'optimize' | 'convert' | 'generate_tests' | 'debug' | 'review';
  language: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  problemExplanation?: string;
  solution?: string;
  convertedCode?: string;
  explanation?: string;
  complexity?: ComplexityDetail | null;
  testCases?: any[];
  warnings?: string[];
  notes?: string[];
  learningExplanation?: string;
}

export interface AIProvider {
  analyzeCode(params: {
    language: string;
    sourceCode: string;
  }): Promise<AnalysisResult>;

  convertCode(params: {
    sourceLanguage: string;
    targetLanguage: string;
    sourceCode: string;
  }): Promise<ConversionResult>;

  processPrompt(params: {
    prompt: string;
    language: string;
    sourceCode?: string;
  }): Promise<PromptResult>;
}
