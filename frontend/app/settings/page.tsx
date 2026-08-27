'use client';

import { useAuthStore } from '../../stores/auth-store';
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your CodeVerix AI profile and preferences
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name || 'Developer'}</h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold uppercase">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Email Address</span>
            </div>
            <p className="text-white font-mono text-sm">{user?.email || 'N/A'}</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold uppercase">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Account Created</span>
            </div>
            <p className="text-white text-sm">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start space-x-3 text-xs text-blue-300">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Secure HTTP-Only Session</span>
            <span>
              Your session is authenticated via secure HTTP-only cookies. JWT tokens and AI API keys are strictly preserved on the server side.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
