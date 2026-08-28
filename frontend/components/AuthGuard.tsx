'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/auth-store';
import { Loader2 } from 'lucide-react';

const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!isAuthenticated) {
      if (!isPublicRoute) {
        router.replace('/login');
      }
    } else {
      if (isPublicRoute || pathname === '/') {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <span className="text-sm font-medium">Verifying authentication...</span>
      </div>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-sans text-xs">
        Redirecting to login...
      </div>
    );
  }

  if (isAuthenticated && (isPublicRoute || pathname === '/')) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-sans text-xs">
        Redirecting to dashboard...
      </div>
    );
  }

  return <>{children}</>;
}
