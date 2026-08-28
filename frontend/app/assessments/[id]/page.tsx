'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { apiClient, ApiError } from '../../../lib/api-client';
import { Assessment, AssessmentSubmissionReport } from '../../../types';
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Loader2,
  Award,
  BookOpen,
  Layers,
  Terminal,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  Send,
} from 'lucide-react';

const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-full bg-slate-900 flex items-center justify-center text-slate-500 text-xs font-mono">Loading Monaco Editor...</div>,
});

const SUPPORTED_LANGUAGES = ['Java', 'Python', 'C', 'C++', 'JavaScript', 'TypeScript'] as const;

const MONACO_LANG_MAP: Record<string, string> = {
  Java: 'java',
  Python: 'python',
  C: 'c',
  'C++': 'cpp',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
};

export default function AssessmentWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Java');
  const [sourceCode, setSourceCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [report, setReport] = useState<AssessmentSubmissionReport | null>(null);

  const [timesCompiledCount, setTimesCompiledCount] = useState(0);

  const [codePerLang, setCodePerLang] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchAssessmentDetails();
    }
  }, [id]);

  const fetchAssessmentDetails = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const data = await apiClient<Assessment>(`/assessments/${id}`);
      setAssessment(data);

      const defaultLang = 'Java';
      setSelectedLanguage(defaultLang);
      const starter = (data.starterCode?.[defaultLang] !== undefined ? data.starterCode[defaultLang] : '') || '';
      setSourceCode(starter);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load assessment details.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackStarterCode = (lang: string) => {
    return '';
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    const userCodeForNewLang = codePerLang[newLang] !== undefined ? codePerLang[newLang] : ((assessment?.starterCode?.[newLang] !== undefined ? assessment.starterCode[newLang] : '') || '');
    setSourceCode(userCodeForNewLang);
    setReport(null);
  };

  const handleRunCode = async () => {
    if (!sourceCode || sourceCode.trim() === '') {
      setErrorMsg(`Please enter ${selectedLanguage} source code before running test cases.`);
      return;
    }

    try {
      setIsRunning(true);
      setErrorMsg(null);
      setTimesCompiledCount((prev) => prev + 1);

      const res = await apiClient<AssessmentSubmissionReport>(`/assessments/${id}/run`, {
        method: 'POST',
        body: JSON.stringify({
          language: selectedLanguage,
          sourceCode,
        }),
      });

      setReport({
        ...res,
        timesCompiled: timesCompiledCount + 1,
        timesSubmitted: assessment?.timesSubmitted || 0,
      });
    } catch (err: any) {
      setErrorMsg(err instanceof ApiError ? err.message : 'Execution failed.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!sourceCode || sourceCode.trim() === '') {
      setErrorMsg(`Please enter ${selectedLanguage} source code before submitting.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setTimesCompiledCount((prev) => prev + 1);

      const res = await apiClient<AssessmentSubmissionReport>(`/assessments/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          language: selectedLanguage,
          sourceCode,
        }),
      });

      setReport({
        ...res,
        timesCompiled: timesCompiledCount + 1,
        timesSubmitted: res.timesSubmitted || (assessment?.timesSubmitted || 0) + 1,
      });

      if (assessment) {
        setAssessment({
          ...assessment,
          timesSubmitted: res.timesSubmitted || (assessment.timesSubmitted || 0) + 1,
        });
      }
    } catch (err: any) {
      setErrorMsg(err instanceof ApiError ? err.message : 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    setSourceCode('');
    setCodePerLang((prev) => ({ ...prev, [selectedLanguage]: '' }));
    setReport(null);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-3" />
        <span>Loading Assessment Environment...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* Top Navbar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Link
            href="/assessments"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Assessments"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center space-x-3">
            <span className="text-xs uppercase font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              {assessment?.difficulty}
            </span>
            <h1 className="text-sm font-bold text-white max-w-[200px] sm:max-w-xs truncate">
              {assessment?.title}
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
            onClick={handleResetCode}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent transition-all flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center space-x-2 transition-all"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Compiling & Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-blue-400" />
                <span>Run Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 flex items-center space-x-2 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating All Testcases...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Solution</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 text-xs text-red-400 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Split View */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden min-h-0">
        {/* Left Side: Question Panel */}
        <div className="flex flex-col h-full overflow-y-auto p-6 bg-slate-950 space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-2">
              <span>Subject: {assessment?.subject}</span>
              <span>•</span>
              <span>Topic: {assessment?.topic}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{assessment?.title}</h2>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                Max Score: {assessment?.totalMarks} Marks
              </span>
              <span className="text-xs text-slate-400">
                Question Type: {assessment?.questionType}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Problem Description
            </h3>
            <div className="prose prose-invert prose-sm text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {assessment?.description}
            </div>
          </div>

          {/* Visible Testcases Spec */}
          {assessment?.testCases && assessment.testCases.length > 0 && (
            <div className="border-t border-slate-800/80 pt-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sample Test Cases
              </h3>
              {assessment.testCases.map((tc, idx) => (
                <div key={tc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/60 pb-1.5">
                    <span className="font-bold flex items-center space-x-1.5">
                      {tc.isHidden ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-yellow-500" />
                          <span>Test Case {idx + 1} (Hidden)</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span>Sample Test Case {idx + 1}</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500">{tc.marks} Marks</span>
                  </div>

                  {!tc.isHidden ? (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">INPUT</span>
                        <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-300 overflow-x-auto">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">EXPECTED OUTPUT</span>
                        <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-green-400 overflow-x-auto">
                          {tc.expectedOutput}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-[11px] italic pt-1">
                      Input and expected output are hidden for evaluation integrity.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Monaco Code Editor + Evaluation Results */}
        <div className="flex flex-col h-full overflow-hidden bg-slate-950">
          {/* Code Editor Container */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="h-9 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400 font-mono flex-shrink-0">
              <span className="flex items-center space-x-2">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{selectedLanguage.toUpperCase()} SOLUTION</span>
              </span>
              <span className="text-[11px] text-slate-500">Language: {selectedLanguage}</span>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <Editor
                height="100%"
                language={MONACO_LANG_MAP[selectedLanguage] || 'c'}
                theme="vs-dark"
                value={sourceCode}
                onChange={(value) => {
                  const val = value || '';
                  setSourceCode(val);
                  setCodePerLang((prev) => ({ ...prev, [selectedLanguage]: val }));
                }}
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

          {/* Bottom Results Panel (Assessment Execution Results) */}
          <div className="h-72 border-t border-slate-800 bg-slate-900 flex flex-col flex-shrink-0">
            <div className="h-9 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-950 text-xs font-mono flex-shrink-0">
              <div className="flex items-center space-x-3">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-slate-200">TESTCASE EVALUATION REPORT</span>
              </div>

              {report && (
                <div className="flex items-center space-x-4 text-[11px]">
                  <span className="text-slate-400">
                    Compiled: <strong className="text-slate-200">{report.timesCompiled || timesCompiledCount}</strong>
                  </span>
                  <span className="text-slate-400">
                    Submitted: <strong className="text-slate-200">{report.timesSubmitted || assessment?.timesSubmitted || 0}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
              {!report ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-2 py-8">
                  <Play className="w-8 h-8 text-slate-700" />
                  <p className="text-slate-400 font-medium">No Code Executed Yet</p>
                  <p className="text-xs text-slate-600 max-w-xs">
                    Click "Run Code" to test visible cases or "Submit Solution" to run against all test cases.
                  </p>
                </div>
              ) : (
                <>
                  {/* Status Header Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                    {/* Overall Status Badge */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 uppercase">Status</span>
                      <span
                        className={`text-sm font-bold mt-1 ${
                          report.status === 'Accepted'
                            ? 'text-green-400'
                            : report.status === 'Wrong Answer'
                            ? 'text-red-400'
                            : report.status === 'Compilation Error'
                            ? 'text-yellow-400'
                            : 'text-purple-400'
                        }`}
                      >
                        {report.status === 'Accepted'
                          ? 'Correct Answer'
                          : report.status}
                      </span>
                    </div>

                    {/* Marks Obtained */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 uppercase">Marks Obtained</span>
                      <span className="text-sm font-bold text-blue-400 mt-1">
                        {report.score ?? 0} / {assessment?.totalMarks || 100}
                      </span>
                    </div>

                    {/* Testcase Pass Ratio */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 uppercase">Testcases Passed</span>
                      <span className="text-sm font-bold text-slate-200 mt-1">
                        {report.passedTests} / {report.totalTests} Passed
                      </span>
                    </div>

                    {/* Execution Time */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 uppercase">Total Execution Time</span>
                      <span className="text-sm font-bold text-slate-300 mt-1 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{report.executionTime ?? 0} ms</span>
                      </span>
                    </div>
                  </div>

                  {/* Compiler Message Box */}
                  {report.compilerMessage && (
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                        Console / Compiler Message
                      </span>
                      <pre
                        className={`p-3 rounded-xl border font-mono text-xs overflow-x-auto whitespace-pre-wrap ${
                          report.status === 'Compilation Error'
                            ? 'bg-red-500/10 border-red-500/20 text-red-300'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        {report.compilerMessage}
                      </pre>
                    </div>
                  )}

                  {/* Interactive Testcase Table */}
                  {report.results && report.results.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                        Test Case Results Table
                      </span>

                      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-900/80 text-slate-400 text-[11px] font-mono border-b border-slate-800">
                              <th className="p-2.5">Test Case</th>
                              <th className="p-2.5 text-center">Result</th>
                              <th className="p-2.5">Status</th>
                              <th className="p-2.5">Time(ms)</th>
                              <th className="p-2.5">Message</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                            {report.results.map((r) => (
                              <tr key={r.testCaseNumber} className="hover:bg-slate-900/40">
                                <td className="p-2.5 font-bold text-slate-300">
                                  {r.isHidden ? (
                                    <span className="flex items-center space-x-1">
                                      <span>Case {r.testCaseNumber}</span>
                                      <span className="text-[10px] text-yellow-500 font-sans">(Hidden)</span>
                                    </span>
                                  ) : (
                                    <span>Case {r.testCaseNumber}</span>
                                  )}
                                </td>
                                <td className="p-2.5 text-center">
                                  {r.status === 'Passed' ? (
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20 text-green-400">
                                      ✓
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400">
                                      ✗
                                    </span>
                                  )}
                                </td>
                                <td className="p-2.5">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      r.status === 'Passed'
                                        ? 'bg-green-500/20 text-green-400'
                                        : r.status === 'Time Limit Exceeded'
                                        ? 'bg-purple-500/20 text-purple-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}
                                  >
                                    {r.status}
                                  </span>
                                </td>
                                <td className="p-2.5 text-slate-400">{r.executionTime} ms</td>
                                <td className="p-2.5 text-slate-300">{r.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
