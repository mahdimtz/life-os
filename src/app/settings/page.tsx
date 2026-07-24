'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { dataApi } from '@/lib/api';
import {
  Palette,
  Bell,
  Heart,
  Database,
  Info,
  Sun,
  Moon,
  Monitor,
  Plus,
  X,
  Clock,
  Download,
  Trash2,
  Check,
  LogOut,
} from 'lucide-react';

const THEMES = [
  { value: 'dark' as const, label: 'تاریک', icon: Moon, description: 'راحت برای چشم' },
  { value: 'light' as const, label: 'روشن', icon: Sun, description: 'روشن و واضح' },
  { value: 'system' as const, label: 'سیستم', icon: Monitor, description: 'مطابق با OS' },
];

export default function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [newValue, setNewValue] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleAddValue = () => {
    const trimmed = newValue.trim();
    if (trimmed && !settings.identityValues.includes(trimmed)) {
      updateSettings({ identityValues: [...settings.identityValues, trimmed] });
      setNewValue('');
    }
  };

  const handleRemoveValue = (value: string) => {
    updateSettings({
      identityValues: settings.identityValues.filter((v) => v !== value),
    });
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      await dataApi.reset();
      // window.location.reload();
    } catch {
      setResetting(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const data = await dataApi.exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    } finally {
      setExporting(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await dataApi.seed();
      // window.location.reload();
    } catch {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10 max-w-[800px] mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">تنظیمات</h1>
        <p className="text-muted text-xs sm:text-sm">تجربه LifeOS خودت رو پیکربندی کن</p>
      </header>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Palette className="w-4 h-4" />
            ظاهر
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {THEMES.map((theme) => {
            const Icon = theme.icon;
            const isActive = settings.theme === theme.value;
            return (
              <button
                key={theme.value}
                onClick={() => updateSettings({ theme: theme.value })}
                className={`relative flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-muted bg-surface-hover'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                    ${isActive ? 'bg-accent/20' : 'bg-muted/10'}
                  `}
                >
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-accent' : 'text-muted'}`}
                  />
                </div>
                <div className="text-center">
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      isActive ? 'text-accent' : 'text-text'
                    }`}
                  >
                    {theme.label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted mt-0.5">{theme.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Bell className="w-4 h-4" />
            اعلان‌ها
          </CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">یادآوری روزانه</p>
              <p className="text-xs text-muted mt-0.5">
                اعلان برای شروع روز دریافت کن
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({ dailyReminder: !settings.dailyReminder })
              }
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer
                ${settings.dailyReminder ? 'bg-accent' : 'bg-muted/30'}
              `}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200
                  ${settings.dailyReminder ? 'translate-x-7' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {settings.dailyReminder && (
            <div className="flex items-center gap-3 pl-0 sm:pl-4">
              <Clock className="w-4 h-4 text-muted" />
              <Input
                type="time"
                value={settings.reminderTime}
                onChange={(e) =>
                  updateSettings({ reminderTime: e.target.value })
                }
                className="w-32"
              />
              <span className="text-xs text-muted">ساعت یادآوری</span>
            </div>
          )}
        </div>
      </Card>

      {/* Identity Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Heart className="w-4 h-4" />
            ارزش‌های هویتی
          </CardTitle>
          <Badge variant="info">{settings.identityValues.length}</Badge>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {settings.identityValues.map((value) => (
              <div
                key={value}
                className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-accent/10 border border-accent/20 transition-all duration-200 hover:border-accent/40"
              >
                <span className="text-sm font-medium text-accent">{value}</span>
                <button
                  onClick={() => handleRemoveValue(value)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="ارزش جدید اضافه کن..."
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddValue()}
              className="flex-1"
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleAddValue}
              disabled={!newValue.trim()}
            >
              <Plus className="w-4 h-4" />
              اضافه
            </Button>
          </div>
          <p className="text-xs text-muted">
            این ارزش‌ها چیزایی هستن که می‌خوای بهشون پایبند باشی. هر وقت طبق یکیشون عمل کردی، از داشبورد رأی بزن تا پیشرفتت رو ببینی.
          </p>
        </div>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Database className="w-4 h-4" />
            داده‌ها
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">دانلود داده‌ها</p>
              <p className="text-xs text-muted mt-0.5">
                تمام داده‌ها رو به صورت JSON دانلود کن
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleExportData} disabled={exporting}>
              <Download className="w-4 h-4" />
              {exporting ? 'در حال دانلود...' : 'دانلود'}
            </Button>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">بارگذاری داده نمونه</p>
              <p className="text-xs text-muted mt-0.5">
                داده‌های نمونه برای تست بارگذاری کن
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleSeedData} disabled={seeding}>
              {seeding ? 'در حال بارگذاری...' : 'بارگذاری'}
            </Button>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-danger">پاک کردن تمام داده‌ها</p>
              <p className="text-xs text-muted mt-0.5">
                تمام داده‌ها رو برای همیشه پاک کن
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
              پاک کردن
            </Button>
          </div>

          {showResetConfirm && (
            <div className="p-4 rounded-xl bg-danger/5 border border-danger/20 space-y-3">
              <p className="text-sm text-text">
                مطمئنی؟ این کار غیرقابل بازگشت است.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleResetData}
                  disabled={resetting}
                >
                  {resetting ? 'در حال پاک کردن...' : 'بله، همه چیز رو پاک کن'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResetConfirm(false)}
                >
                  انصراف
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Info className="w-4 h-4" />
            درباره
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">نسخه</span>
            <Badge variant="default">2.0.0</Badge>
          </div>
          <div className="h-px bg-border" />
          <div className="text-center py-4">
            <p className="text-lg font-semibold text-text tracking-tight">
              LifeOS
            </p>
            <p className="text-sm text-muted mt-1">
              هویتت رو بساز، یه رأی در یک زمان.
            </p>
            <p className="text-xs text-muted mt-2">
              فول‌استک · Next.js · Prisma · SQLite
            </p>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <LogOut className="w-4 h-4" />
            امنیت
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">خروج از حساب</p>
              <p className="text-xs text-muted mt-0.5">
                برای محافظت از اطلاعاتت خارج شو
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await fetch('/api/auth', { method: 'DELETE' });
                window.location.href = '/login';
              }}
            >
              <LogOut className="w-4 h-4" />
              خروج
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
