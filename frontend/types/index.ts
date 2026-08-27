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
