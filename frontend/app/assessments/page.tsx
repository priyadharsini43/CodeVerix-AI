'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { Assessment } from '../../types';
import { Award, BookOpen, Layers, ChevronRight, Loader2, FileCode, Search, CheckCircle2, Clock } from 'lucide-react';

// Canonical Placement Topic List
const CANONICAL_TOPICS = [
  'All Topics',
  'Arrays',
  'Strings',
  'Basic Math',
  'Hash Table',
  'Two Pointers',
  'Sliding Window',
  'Sorting',
  'Searching',
  'Stack',
  'Queue',
  'Matrix',
  'Recursion',
  'Dynamic Programming',
] as const;

// Normalize legacy/inconsistent DB topics to canonical topics for UI & filtering
function normalizeTopic(rawTopic: string): string {
  if (!rawTopic) return 'Basic Math';
  const t = rawTopic.trim();

  if (t === 'Arrays' || t === 'Arrays & Sets') return 'Arrays';
  if (t === 'Strings' || t === 'Math & Strings' || t === 'Strings & Maps') return 'Strings';
  if (
    t === 'Basic Math' ||
    t === 'Basic Arithmetic' ||
    t === 'Math Basics' ||
    t === 'Math & Conditionals' ||
    t === 'Conditionals' ||
    t === 'Loops' ||
    t === 'Loops & Sequences'
  ) {
    return 'Basic Math';
  }
  if (t === 'Hash Table') return 'Hash Table';
  if (t === 'Two Pointers') return 'Two Pointers';
  if (t === 'Sliding Window') return 'Sliding Window';
  if (t === 'Sorting' || t === 'Sorting & Arrays') return 'Sorting';
  if (t === 'Searching') return 'Searching';
  if (t === 'Stack') return 'Stack';
  if (t === 'Queue') return 'Queue';
  if (t === 'Matrix') return 'Matrix';
  if (t === 'Recursion' || t === 'Loops & Recursion') return 'Recursion';
  if (t === 'Dynamic Programming') return 'Dynamic Programming';

  return 'Basic Math';
}

export default function PracticeCatalogPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient<Assessment[]>('/assessments');
      setAssessments(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load practice problems.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered problems list using topic normalization
  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      const canonicalTopic = normalizeTopic(item.topic);

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        canonicalTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;

      const matchesTopic =
        selectedTopic === 'All Topics' ||
        selectedTopic === 'All' ||
        canonicalTopic === selectedTopic;

      return matchesSearch && matchesDifficulty && matchesTopic;
    });
  }, [assessments, searchQuery, selectedDifficulty, selectedTopic]);

  // Difficulty Counts
  const easyCount = useMemo(() => assessments.filter((a) => a.difficulty === 'Easy').length, [assessments]);
  const mediumCount = useMemo(() => assessments.filter((a) => a.difficulty === 'Medium').length, [assessments]);
  const hardCount = useMemo(() => assessments.filter((a) => a.difficulty === 'Hard').length, [assessments]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Award className="w-7 h-7 text-blue-500" />
            <span>Practice Problems</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Master high-value placement & interview coding patterns across Java, Python, C, C++, JavaScript & TypeScript.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg font-semibold">
            Easy: {easyCount}
          </span>
          <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-lg font-semibold">
            Medium: {mediumCount}
          </span>
          <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg font-semibold">
            Hard: {hardCount}
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search problem title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="md:col-span-4 flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                selectedDifficulty === diff
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Canonical Topic Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all"
          >
            {CANONICAL_TOPICS.map((topicName) => (
              <option key={topicName} value={topicName} className="bg-slate-900 text-white">
                {topicName === 'All Topics' ? 'All Topics' : `Topic: ${topicName}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Content Section */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-3" />
          <span>Loading placement practice catalog...</span>
        </div>
      ) : filteredAssessments.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl mt-8 p-8">
          <FileCode className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">No Problems Match Criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search query or filter selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredAssessments.map((item) => {
            const canonicalTopic = normalizeTopic(item.topic);
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.difficulty === 'Easy'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : item.difficulty === 'Medium'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {item.difficulty}
                    </span>

                    {/* Practice Status */}
                    {item.status === 'Solved' ? (
                      <span className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Solved</span>
                      </span>
                    ) : item.status === 'Attempted' ? (
                      <span className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Attempted</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                        {item.totalMarks} Marks
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {item.title}
                  </h2>

                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 py-3 border-t border-b border-slate-800/80 mb-4 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.subject || 'Programming'}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      <span>{canonicalTopic}</span>
                    </div>
                  </div>

                  <Link
                    href={`/assessments/${item.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
                  >
                    <span>{item.status === 'Solved' ? 'Solve Again' : 'Solve Challenge'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
