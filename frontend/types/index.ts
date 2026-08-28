export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  defaultLanguage: string;
  createdAt: string;
  updatedAt: string;
  submissions?: Submission[];
  _count?: {
    submissions: number;
  };
}

export interface BugDetail {
  line?: number | null; // AI-detected location
  type: 'syntax' | 'runtime' | 'logical' | 'type' | 'performance' | 'security';
  severity: 'high' | 'medium' | 'low';
  message: string;
  explanation: string;
}

export interface ComplexityDetail {
  time?: string;
  space?: string;
}

export interface Analysis {
  id: string;
  status: 'bug_found' | 'no_bug_found' | 'analysis_failed';
  bugs: BugDetail[];
  explanation: string;
  fixedCode?: string | null; // Nullable
  complexity?: ComplexityDetail | null; // Nullable
  confidence: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  projectId: string;
  language: string;
  sourceCode: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
    defaultLanguage: string;
  };
  analysis?: Analysis | null;
}

export interface DashboardStats {
  projectsCount: number;
  submissionsCount: number;
  aiFixesCount: number;
}

// Assessment Platform Types
export interface TestCase {
  id: string;
  testCaseNumber: number;
  isHidden: boolean;
  marks: number;
  input?: string | null;
  expectedOutput?: string | null;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  subject: string;
  topic: string;
  questionType: string;
  totalMarks: number;
  allowedLanguages: string;
  starterCode?: Record<string, string> | null;
  createdAt: string;
  timesSubmitted?: number;
  totalTestCases?: number;
  submissionCount?: number;
  status?: string;
  testCases?: TestCase[];
  recentSubmissions?: AssessmentSubmission[];
}

export interface TestCaseExecutionResult {
  testCaseNumber: number;
  testCaseId: string;
  status: 'Passed' | 'Failed' | 'Error' | 'Time Limit Exceeded';
  isHidden?: boolean;
  input?: string | null;
  expectedOutput?: string | null;
  actualOutput?: string | null;
  executionTime: number;
  message: string;
}

export interface AssessmentSubmissionReport {
  submissionId?: string;
  assessmentId?: string;
  status: 'Accepted' | 'Wrong Answer' | 'Compilation Error' | 'Runtime Error' | 'Time Limit Exceeded';
  score?: number;
  totalMarks?: number;
  passedTests: number;
  totalTests: number;
  executionTime?: number;
  compilerMessage: string | null;
  timesSubmitted?: number;
  timesCompiled?: number;
  createdAt?: string;
  results: TestCaseExecutionResult[];
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  userId: string;
  language: string;
  sourceCode: string;
  status: string;
  score: number;
  passedTests: number;
  totalTests: number;
  executionTime: number;
  compilerMessage?: string | null;
  createdAt: string;
}
