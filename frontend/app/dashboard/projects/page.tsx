'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient, ApiError } from '../../../lib/api-client';
import { Project } from '../../../types';
import {
  FolderGit2,
  Plus,
  Search,
  Code2,
  Trash2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react';

const SUPPORTED_LANGUAGES = ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript'] as const;

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional(),
  defaultLanguage: z.enum(SUPPORTED_LANGUAGES, {
    errorMap: () => ({ message: 'Please select a supported language' }),
  }),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      defaultLanguage: 'Python',
    },
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const data = await apiClient<Project[]>('/projects');
      setProjects(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (values: CreateProjectFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const newProject = await apiClient<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      setProjects((prev) => [newProject, ...prev]);
      reset();
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete project '${name}'?`)) return;

    try {
      await apiClient(`/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.defaultLanguage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage code projects & AI repair workspaces
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search projects by name or language..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
          <span>Loading projects...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl">
          <FolderGit2 className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white">No projects found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            {searchQuery ? 'No projects match your search criteria.' : 'Create your first project to begin AI code analysis.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                    {project.defaultLanguage.substring(0, 3).toUpperCase()}
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {project.defaultLanguage}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem]">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Submissions: {project._count?.submissions || 0}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/workspace/${project.id}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
                  >
                    <span>Workspace</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateProject)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Python Debugging Workspace"
                  {...register('name')}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Default Language *
                </label>
                <select
                  {...register('defaultLanguage')}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Note: AI analysis & structured fixes are supported for all listed languages today.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description of this project's purpose..."
                  {...register('description')}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center space-x-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Project</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
