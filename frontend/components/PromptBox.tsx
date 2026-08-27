import { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';

interface PromptBoxProps {
  onPromptSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

export function PromptBox({ onPromptSubmit, isLoading }: PromptBoxProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onPromptSubmit(prompt);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-4 shrink-0">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 max-w-4xl mx-auto w-full">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>CodeVerix Prompt</span>
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-sans"
            placeholder="E.g., Convert this to Python, Fix bugs, Optimize my code..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-md transition-all flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
