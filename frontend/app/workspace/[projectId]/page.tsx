'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PromptBox } from '../../../components/PromptBox';
import { apiClient, ApiError } from '../../../lib/api-client';
import { Project, Submission, Analysis, BugDetail } from '../../../types';
import {
  Code2,
  Sparkles,
  Play,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  FileCode,
  Layers,
  Clock,
  ArrowLeft,
  Loader2,
  GitCompare,
} from 'lucide-react';

// Dynamically import Monaco Editor and DiffEditor for SSR compatibility
const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-full bg-slate-900 flex items-center justify-center text-slate-500 text-xs font-mono">Loading Monaco Editor...</div>,
});

const DiffEditor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.DiffEditor), {
  ssr: false,
  loading: () => <div className="h-full bg-slate-900 flex items-center justify-center text-slate-500 text-xs font-mono">Loading Monaco Diff...</div>,
});

const SUPPORTED_LANGUAGES = ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript'] as const;

const MONACO_LANG_MAP: Record<string, string> = {
  Python: 'python',
  Java: 'java',
  C: 'c',
  'C++': 'cpp',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
};

const DEFAULT_CODE_SAMPLES: Record<string, string> = {
  Python: `def calculate_average(numbers):\n    total = sum(numbers)\n    return total / len(numbers)\n\nprint(calculate_average([]))`,
  Java: `public class Main {\n    public static void main(String[] args) {\n        int[] numbers = {};\n        int sum = 0;\n        for (int n : numbers) {\n            sum += n;\n        }\n        System.out.println(sum / numbers.length);\n    }\n}`,
  C: `#include <stdio.h>\n\nint main() {\n    int numbers[0];\n    int sum = 0;\n    printf("%d\\n", sum / 0);\n    return 0;\n}`,
  'C++': `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums;\n    int avg = nums.at(0);\n    std::cout << avg;\n    return 0;\n}`,
  JavaScript: `function calculateAverage(numbers) {\n  const total = numbers.reduce((acc, curr) => acc + curr, 0);\n  return total / numbers.length;\n}\n\nconsole.log(calculateAverage([]));`,
  TypeScript: `function calculateAverage(numbers: number[]): number {\n  const total = numbers.reduce((acc, curr) => acc + curr, 0);\n  return total / numbers.length;\n}\n\nconsole.log(calculateAverage([]));`,
};

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Python');
  const [sourceCode, setSourceCode] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<Analysis | null>(null);
  const [activeTab, setActiveTab] = useState<'problems' | 'explanation' | 'history'>('problems');
  const [showDiffView, setShowDiffView] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setIsLoadingProject(true);
      setErrorMsg(null);
      const data = await apiClient<Project>(`/projects/${projectId}`);
      setProject(data);
      setSelectedLanguage(data.defaultLanguage);
      setSourceCode(DEFAULT_CODE_SAMPLES[data.defaultLanguage] || DEFAULT_CODE_SAMPLES['Python']);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load project.');
    } finally {
      setIsLoadingProject(false);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    if (!sourceCode || Object.values(DEFAULT_CODE_SAMPLES).includes(sourceCode)) {
      setSourceCode(DEFAULT_CODE_SAMPLES[newLang] || '');
    }
  };

  const handleClearCode = () => {
    setSourceCode('');
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  const handleAnalyzeAndFix = async () => {
    if (!sourceCode || sourceCode.trim() === '') {
      setErrorMsg('Please enter source code before running AI analysis.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setErrorMsg(null);

      const response = await apiClient<{ analysis: Analysis }>('/submissions/analyze', {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          language: selectedLanguage,
          sourceCode,
        }),
      });

      setAnalysisResult(response.analysis);
      setActiveTab('problems');
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred while communicating with the AI service.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePromptSubmit = async (promptText: string) => {
    try {
      setIsPrompting(true);
      setErrorMsg(null);
      const response = await apiClient<any>('/submissions/prompt', {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          language: selectedLanguage,
          sourceCode,
          prompt: promptText
        }),
      });

      // Update UI with prompt response
      if (response.intent === 'convert') {
        setSelectedLanguage(response.language);
      }

      setAnalysisResult({
        language: response.language,
        status: response.solution ? 'bug_found' : 'no_bug_found',
        bugs: response.testCases?.map((tc: any) => ({
          type: 'logical', severity: 'low', message: `Test Case: Input ${tc.input}`, explanation: `Expected ${tc.expected}`
        })) || [],
        fixedCode: response.solution || null,
        explanation: response.learningExplanation || response.problemExplanation || `Intent: ${response.intent.toUpperCase()}`,
        complexity: response.complexity || null,
        confidence: 0.9,
      } as unknown as Analysis);

      if (response.solution) {
        setShowDiffView(true);
      }
      setActiveTab('explanation');
      
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred while communicating with the AI service.');
      }
    } finally {
      setIsPrompting(false);
    }
  };

  const handleCopyFixedCode = () => {
    if (analysisResult?.fixedCode) {
      navigator.clipboard.writeText(analysisResult.fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoadingProject) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400 bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-3" />
        <span>Loading IDE workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* IDE Top Toolbar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/projects"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Projects"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold text-slate-500">Project:</span>
            <h1 className="text-sm font-bold text-white max-w-[200px] sm:max-w-xs truncate">
              {project?.name || 'Workspace'}
            </h1>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 border-l border-slate-800 pl-4">
            <label className="text-xs text-slate-400 font-medium">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs text-blue-400 font-mono font-semibold px-2.5 py-1 focus:outline-none focus:border-blue-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClearCode}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Code</span>
          </button>

          {analysisResult?.fixedCode && (
            <button
              onClick={() => setShowDiffView(!showDiffView)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                showDiffView
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{showDiffView ? 'Code Mode' : 'Diff Mode'}</span>
            </button>
          )}

          <button
            onClick={handleAnalyzeAndFix}
            disabled={isAnalyzing}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 flex items-center space-x-2 transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Code...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze & Fix</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 text-xs text-red-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Universal Prompt Box */}
      <PromptBox onPromptSubmit={handlePromptSubmit} isLoading={isPrompting} />

      {/* Main Workspace Split View (Buggy Code vs AI Fixed Code) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-950 overflow-hidden min-h-0">
        {/* Left Side: Original Input Code Editor */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="h-9 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400 font-mono flex-shrink-0">
            <span className="flex items-center space-x-2">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>BUGGY CODE (INPUT)</span>
            </span>
            <span className="text-[11px] text-slate-500">
              {sourceCode.split('\n').length} lines
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <Editor
              height="100%"
              language={MONACO_LANG_MAP[selectedLanguage] || 'python'}
              theme="vs-dark"
              value={sourceCode}
              onChange={(value) => setSourceCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                lineNumbersMinChars: 3,
              }}
            />
          </div>
        </div>

        {/* Right Side: AI Result & Fixed Code Editor / Diff View */}
        <div className="flex flex-col h-full overflow-hidden bg-slate-950">
          <div className="h-9 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400 font-mono flex-shrink-0">
            <span className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-green-400" />
              <span>
                {showDiffView ? 'DIFF COMPARISON' : 'AI STRUCTURED FIX (OUTPUT)'}
              </span>
            </span>

            {analysisResult?.fixedCode && (
              <button
                onClick={handleCopyFixedCode}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Fixed Code'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 relative overflow-hidden">
            {isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-sm font-medium text-white">Gemini AI is analyzing your code...</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Parsing syntax, identifying logical errors, and preparing structured fixes.
                </p>
              </div>
            ) : showDiffView && analysisResult?.fixedCode ? (
              <DiffEditor
                height="100%"
                language={MONACO_LANG_MAP[selectedLanguage] || 'python'}
                theme="vs-dark"
                original={sourceCode}
                modified={analysisResult.fixedCode}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 },
                }}
              />
            ) : analysisResult ? (
              analysisResult.fixedCode ? (
                <Editor
                  height="100%"
                  language={MONACO_LANG_MAP[selectedLanguage] || 'python'}
                  theme="vs-dark"
                  value={analysisResult.fixedCode}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                  }}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
                  {analysisResult.status === 'analysis_failed' ? (
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  ) : (
                    <Check className="w-10 h-10 text-green-500" />
                  )}
                  <h4 className="text-base font-bold text-white">
                    {analysisResult.status === 'analysis_failed'
                      ? 'Analysis Failed'
                      : analysisResult.status === 'bug_found'
                      ? 'Fix Code Unavailable'
                      : 'No Fix Code Required'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm">
                    {analysisResult.status === 'analysis_failed'
                      ? 'The AI analysis could not be completed safely.'
                      : analysisResult.status === 'no_bug_found'
                      ? 'The AI evaluated this code and found no bugs requiring modifications.'
                      : 'Bugs were detected, but no automated fix code was generated.'}
                  </p>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
                <Code2 className="w-12 h-12 text-slate-800" />
                <h4 className="text-sm font-semibold text-slate-400">No AI Analysis Generated Yet</h4>
                <p className="text-xs text-slate-600 max-w-xs">
                  Enter your code on the left and click "Analyze & Fix" to get real-time AI diagnosis and fixes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Panel: Tabs for Problems | Explanation | History */}
      <div className="h-64 border-t border-slate-800 bg-slate-900 flex flex-col flex-shrink-0">
        {/* Tab Headers */}
        <div className="h-10 border-b border-slate-800 px-4 flex items-center space-x-2 bg-slate-950">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'problems'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Problems / Bugs</span>
            {analysisResult?.bugs && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px]">
                {analysisResult.bugs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'explanation'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Explanation & Complexity</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Project Submissions</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 p-4 overflow-y-auto font-sans text-sm">
          {activeTab === 'problems' && (
            <div>
              {!analysisResult ? (
                <div className="text-slate-500 text-xs text-center py-8">
                  Click "Analyze & Fix" to detect bugs and view AI diagnostic breakdown.
                </div>
              ) : analysisResult.status === 'analysis_failed' ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-start space-x-2.5">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm block mb-1">AI Analysis Temporarily Unavailable</span>
                    <span>{analysisResult.explanation || 'AI analysis is temporarily unavailable because the Gemini service is experiencing high demand. Please try again in a few moments.'}</span>
                  </div>
                </div>
              ) : analysisResult.status === 'no_bug_found' || analysisResult.bugs.length === 0 ? (
                <div className="flex items-center space-x-2 text-green-400 text-xs py-4">
                  <Check className="w-4 h-4" />
                  <span>No bugs detected in code. Status: {analysisResult.status}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 font-semibold mb-2">
                    {analysisResult.bugs.length} Issue(s) Reported by AI Analysis:
                  </div>

                  {analysisResult.bugs.map((bug: BugDetail, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-blue-400">
                            {bug.line != null ? `AI-Detected Line ${bug.line}` : 'AI-Detected Location'}
                          </span>
                          <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {bug.type}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            bug.severity === 'high'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : bug.severity === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {bug.severity} Severity
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-white">{bug.message}</p>
                      <p className="text-xs text-slate-400">{bug.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'explanation' && (
            <div className="space-y-4">
              {!analysisResult ? (
                <div className="text-slate-500 text-xs text-center py-8">
                  No analysis available yet.
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Root Cause Explanation
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                      {analysisResult.explanation}
                    </p>
                  </div>

                  {analysisResult.complexity && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Estimated Complexity
                      </h4>
                      <div className="grid grid-cols-2 gap-4 max-w-sm">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                          <span className="text-[10px] uppercase text-slate-500 block">Time Complexity</span>
                          <span className="text-sm font-mono font-bold text-blue-400">
                            {analysisResult.complexity.time || 'N/A'}
                          </span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                          <span className="text-[10px] uppercase text-slate-500 block">Space Complexity</span>
                          <span className="text-sm font-mono font-bold text-purple-400">
                            {analysisResult.complexity.space || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 mb-2">
                Recent submissions in project '{project?.name}':
              </p>
              {project?.submissions && project.submissions.length > 0 ? (
                <div className="space-y-2">
                  {project.submissions.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-blue-400">{sub.language}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">
                          {new Date(sub.createdAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          sub.analysis?.status === 'bug_found'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {sub.analysis?.status || 'Submitted'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-4">No previous submissions for this project.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
