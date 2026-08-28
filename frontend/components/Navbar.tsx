'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/auth-store';
import { Code2, LayoutDashboard, FolderGit2, History, Settings, LogOut, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                CodeVerix AI
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-slate-800 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/projects"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/dashboard/projects')
                    ? 'bg-slate-800 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Projects</span>
              </Link>
              <Link
                href="/dashboard/history"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/dashboard/history')
                    ? 'bg-slate-800 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>
              <Link
                href="/assessments"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/assessments')
                    ? 'bg-slate-800 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Practice</span>
              </Link>
              <Link
                href="/settings"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/settings'
                    ? 'bg-slate-800 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </nav>
          )}

          {/* User Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-300 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow-md shadow-blue-600/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
