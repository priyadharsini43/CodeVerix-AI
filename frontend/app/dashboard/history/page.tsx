'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../lib/api-client';
import { Submission } from '../../../types';
import { History as HistoryIcon, Code2, AlertTriangle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient<Submission[]>('/submissions');
      setSubmissions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load submission history.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-3">
          <HistoryIcon className="w-7 h-7 text-blue-400" />
          <span>Submission History</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Audit trail of code submissions analyzed by Gemini AI
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
          <span>Loading submission records from PostgreSQL...</span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
          <Code2 className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white">No history records found</h3>
          <p className="text-sm text-slate-400 mt-1">
            Run an AI analysis in your code workspace to see history entries here.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {sub.analysis?.status === 'bug_found' ? (
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  ) : sub.analysis?.status === 'no_bug_found' ? (
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Code2 className="w-5 h-5" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white">
                        {sub.project?.name || 'Project'}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-slate-800 text-blue-400 border border-slate-700">
                        {sub.language}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {sub.analysis?.explanation || 'No explanation available.'}
                    </p>

                    <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1">
                      <span>Submitted: {new Date(sub.createdAt).toLocaleString()}</span>
                      {sub.analysis?.bugs && Array.isArray(sub.analysis.bugs) && (
                        <span>Bugs: {sub.analysis.bugs.length}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-center">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      sub.analysis?.status === 'bug_found'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : sub.analysis?.status === 'no_bug_found'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {sub.analysis?.status === 'bug_found'
                      ? 'Bug Detected'
                      : sub.analysis?.status === 'no_bug_found'
                      ? 'No Bug Found'
                      : 'Analysis Failed'}
                  </span>

                  <Link
                    href={`/workspace/${sub.projectId}`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Open Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
