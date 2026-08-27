'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../stores/auth-store';
import { apiClient } from '../../lib/api-client';
import { Project, Submission, DashboardStats } from '../../types';
import {
  FolderGit2,
  FileCode2,
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  Code2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const [data, setData] = useState<{
    stats: DashboardStats;
    recentProjects: Project[];
    recentSubmissions: Submission[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboard();
    }
  }, [isAuthenticated]);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient<{
        stats: DashboardStats;
        recentProjects: Project[];
        recentSubmissions: Submission[];
      }>('/history/dashboard');
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard statistics from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-3" />
        <span>Loading PostgreSQL dashboard metrics...</span>
      </div>
    );
  }

  const stats = data?.stats || { projectsCount: 0, submissionsCount: 0, aiFixesCount: 0 };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {user?.name || 'Developer'}! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time code repair workspace & persisted PostgreSQL analytics
          </p>
        </div>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Projects Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Projects
              </p>
              <h3 className="text-3xl font-extrabold text-white mt-2">
                {stats.projectsCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <FolderGit2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Calculated from PostgreSQL records</p>
        </div>

        {/* Submissions Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Submissions
              </p>
              <h3 className="text-3xl font-extrabold text-white mt-2">
                {stats.submissionsCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <FileCode2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Total code runs evaluated by AI</p>
        </div>

        {/* AI Fixes Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                AI Fixes
              </p>
              <h3 className="text-3xl font-extrabold text-white mt-2">
                {stats.aiFixesCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">AI-generated fixes generated</p>
        </div>
      </div>

      {/* Main Content Sections: Recent Projects & Recent Fixes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-blue-400" />
              <span>Recent Projects</span>
            </h2>
            <Link
              href="/dashboard/projects"
              className="text-xs font-medium text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!data?.recentProjects || data.recentProjects.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <FolderGit2 className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm font-medium">No projects created yet</p>
              <p className="text-slate-500 text-xs mt-1 mb-4">Create your first project to start debugging code.</p>
              <Link
                href="/dashboard/projects"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 font-mono text-xs font-bold">
                      {project.defaultLanguage.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Language: {project.defaultLanguage} • Submissions: {project._count?.submissions || 0}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/workspace/${project.id}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-medium transition-all"
                  >
                    Open Workspace
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>Recent Submissions</span>
            </h2>
            <Link
              href="/dashboard/history"
              className="text-xs font-medium text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!data?.recentSubmissions || data.recentSubmissions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <Code2 className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm font-medium">No code submissions yet</p>
              <p className="text-slate-500 text-xs mt-1">Submissions analyzed by Gemini will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {sub.analysis?.status === 'bug_found' ? (
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    ) : sub.analysis?.status === 'no_bug_found' ? (
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                        <Code2 className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">
                        {sub.project?.name || 'Project'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {sub.language} • {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        sub.analysis?.status === 'bug_found'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : sub.analysis?.status === 'no_bug_found'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {sub.analysis?.status === 'bug_found'
                        ? 'Bug Detected'
                        : sub.analysis?.status === 'no_bug_found'
                        ? 'No Bug'
                        : 'Analysis Failed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
