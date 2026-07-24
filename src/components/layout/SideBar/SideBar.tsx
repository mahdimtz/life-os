'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarCheck, CalendarDays, Target, BookOpen, Dumbbell, NotebookPen, Activity, BarChart3, Settings, Menu, X, HelpCircle } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { name: 'داشبورد', href: '/', icon: LayoutDashboard },
  { name: 'امروز', href: '/today', icon: CalendarCheck },
  { name: 'اهداف', href: '/goals', icon: Target },
  { name: 'یادگیری', href: '/learning', icon: BookOpen },
  { name: 'باشگاه', href: '/gym', icon: Dumbbell },
  { name: 'ژورنال', href: '/journal', icon: NotebookPen },
  { name: 'عملیات', href: '/operations', icon: Activity },
  { name: 'آمار', href: '/statistics', icon: BarChart3 },
  { name: 'تنظیمات', href: '/settings', icon: Settings },
  { name: 'راهنما', href: '/guide', icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const identityVotes = useAppStore((s) => s.identityVotes);
  const identityScore = useMemo(() => {
    const last30 = identityVotes.filter((v) => {
      const d = new Date(v.date);
      const now = new Date();
      return now.getTime() - d.getTime() < 30 * 24 * 60 * 60 * 1000;
    });
    return Math.min(100, last30.length * 5);
  }, [identityVotes]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-text">Life<span className="text-accent">OS</span></h1>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={clsx(
          'lg:hidden fixed top-0 right-0 z-50 w-72 h-full bg-surface border-l border-border flex flex-col p-4 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="px-4 py-6 mb-4">
          <h1 className="text-xl font-bold text-text">Life<span className="text-accent">OS</span></h1>
          <p className="text-xs text-muted mt-1">هویتت رو بساز</p>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:text-text hover:bg-background/50'
                )}
              >
                <item.icon size={18} strokeWidth={2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-border">
          <p className="text-xs text-muted">امتیاز هویت: {identityScore}%</p>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen bg-surface border-l border-border flex-col p-4 fixed right-0 top-0">
        <div className="px-4 py-6 mb-4">
          <h1 className="text-xl font-bold text-text">Life<span className="text-accent">OS</span></h1>
          <p className="text-xs text-muted mt-1">هویتت رو بساز</p>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:text-text hover:bg-background/50'
                )}
              >
                <item.icon size={18} strokeWidth={2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-border">
          <p className="text-xs text-muted">امتیاز هویت: {identityScore}%</p>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border px-2 py-1 flex justify-around">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all',
                isActive
                  ? 'text-accent'
                  : 'text-muted'
              )}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium text-muted"
        >
          <Menu size={18} />
          بیشتر
        </button>
      </nav>
    </>
  );
}
