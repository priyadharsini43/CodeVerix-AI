'use client';

import Link from 'next/link';
import { useAuthStore } from '../stores/auth-store';
import { Code2, Sparkles, ShieldCheck, Cpu, ArrowRight, CheckCircle2, Terminal } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex-1 flex flex-col bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 border-b border-slate-800/80">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Code Repair Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            CodeVerix AI
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-slate-300 mb-4 max-w-3xl mx-auto">
            AI-Powered Code Repair and Verification Platform
          </p>

          <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Analyze bugs, generate intelligent fixes, and understand your code with AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={isAuthenticated ? '/dashboard' : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all"
            >
              <span>Start Coding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-base transition-all"
            >
              <span>View Features</span>
            </a>
          </div>
        </div>
      </section>

      {/* Code Workspace Teaser */}
      <section className="py-16 bg-slate-900/30 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-slate-500 font-mono ml-2">codeverix_ai_workspace.py</span>
              </div>
              <div className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2.5 py-1 rounded">
                Python 3.11
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
              <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Input Code</span>
                  <span className="text-red-400 text-xs">AI-Detected Bug</span>
                </div>
                <pre className="text-slate-300">
                  <code>{`def calculate_average(numbers):
    total = sum(numbers)
    # Bug: Division by zero risk
    return total / len(numbers)`}</code>
                </pre>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>AI Structured Fix</span>
                  <span className="text-green-400 text-xs">Correction Ready</span>
                </div>
                <pre className="text-slate-300">
                  <code>{`def calculate_average(numbers):
    if not numbers:
        return 0.0
    return sum(numbers) / len(numbers)`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Designed for Modern Developers
          </h2>
          <p className="text-slate-400">
            Real-time code diagnosis, line-level explanations, structured fixes, and time/space complexity estimates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Gemini AI Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Powered by Google Gemini 2.5 Flash API providing rapid, structured diagnosis for Python, Java, C, C++, JavaScript, and TypeScript.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Monaco IDE Workspace</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Built-in VS Code editor experience with syntax highlighting, side-by-side fix preview, and Monaco diff mode comparison.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-green-600/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Persisted History</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              All projects, submissions, and AI analyses are securely stored in PostgreSQL for seamless auditing and continuous progress tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} CodeVerix AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
