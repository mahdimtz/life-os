'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/SideBar/SideBar';
import { useAppStore } from '@/store/useAppStore';
import { NotificationScheduler } from '@/components/PWAScript';
import { Loader2 } from 'lucide-react';

const PUBLIC_PATHS = ['/login', '/api'];

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.settings.theme);
  const loadData = useAppStore((s) => s.loadData);
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isPublicPage = PUBLIC_PATHS.some(p => pathname.startsWith(p));

  // Check authentication
  useEffect(() => {
    if (isPublicPage) {
      setAuthChecked(true);
      return;
    }

    fetch('/api/auth')
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/login');
        }
      })
      .catch(() => {
        // If API fails, allow access (server might be starting)
        setIsAuthenticated(true);
      })
      .finally(() => setAuthChecked(true));
  }, [pathname, isPublicPage, router]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated || isPublicPage) {
      loadData();
    }
  }, [loadData, isAuthenticated, isPublicPage]);

  // Theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Loading state
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  // Public pages (login) - no sidebar
  if (isPublicPage) {
    return (
      <>
        <NotificationScheduler />
        {children}
      </>
    );
  }

  // Protected pages - with sidebar
  return (
    <>
      <NotificationScheduler />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:mr-64 pt-14 lg:pt-0 pb-20 lg:pb-0 p-4 lg:p-8 overflow-y-auto min-h-screen">
          {children}
        </main>
      </div>
    </>
  );
}
