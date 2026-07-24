'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dumbbell,
  Plus,
  X,
  CheckCircle2,
  Flame,
  Calendar,
  Trash2,
} from 'lucide-react';

const DAYS = [
  { index: 0, label: 'یکشنبه', short: 'ی' },
  { index: 1, label: 'دوشنبه', short: 'د' },
  { index: 2, label: 'سه‌شنبه', short: 'س' },
  { index: 3, label: 'چهارشنبه', short: 'چ' },
  { index: 4, label: 'پنجشنبه', short: 'پ' },
  { index: 5, label: 'جمعه', short: 'ج' },
  { index: 6, label: 'شنبه', short: 'ش' },
];

export default function GymPage() {
  const settings = useAppStore((s) => s.settings);
  const dailyStats = useAppStore((s) => s.dailyStats);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const toggleGymSession = useAppStore((s) => s.toggleGymSession);

  const [newExercise, setNewExercise] = useState('');

  const gymDays = settings.gymDays || [];
  const gymPlan = settings.gymPlan || [];

  const today = new Date().toISOString().split('T')[0];
  const todayStat = useMemo(
    () => dailyStats.find((s) => s.date === today),
    [dailyStats]
  );
  const todayIsGymDay = gymDays.includes(new Date().getDay());

  const gymHistory = useMemo(
    () =>
      dailyStats
        .filter((s) => s.gymSession)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 30),
    [dailyStats]
  );

  const gymStreak = useMemo(() => {
    let streak = 0;
    const sorted = [...dailyStats]
      .filter((s) => s.gymSession)
      .sort((a, b) => b.date.localeCompare(a.date));
    for (const s of sorted) {
      streak++;
    }
    return streak;
  }, [dailyStats]);

  const handleToggleDay = (dayIndex: number) => {
    const newDays = gymDays.includes(dayIndex)
      ? gymDays.filter((d) => d !== dayIndex)
      : [...gymDays, dayIndex].sort();
    updateSettings({ gymDays: newDays });
  };

  const handleAddExercise = () => {
    const trimmed = newExercise.trim();
    if (trimmed && !gymPlan.includes(trimmed)) {
      updateSettings({ gymPlan: [...gymPlan, trimmed] });
      setNewExercise('');
    }
  };

  const handleRemoveExercise = (exercise: string) => {
    updateSettings({ gymPlan: gymPlan.filter((e) => e !== exercise) });
  };

  return (
    <div className="min-h-screen px-2 sm:px-6 py-6 sm:py-10 max-w-[800px] mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">باشگاه</h1>
        <p className="text-muted text-xs sm:text-sm">برنامه ورزشی هفتگیت رو مدیریت کن</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="flex flex-col items-center gap-2 py-4">
          <Flame className="w-5 h-5 text-warning" />
          <p className="text-xl font-bold text-text">{gymStreak}</p>
          <p className="text-[10px] text-muted">جلسه ثبت شده</p>
        </Card>
        <Card className="flex flex-col items-center gap-2 py-4">
          <Calendar className="w-5 h-5 text-accent" />
          <p className="text-xl font-bold text-text">{gymDays.length}</p>
          <p className="text-[10px] text-muted">روز در هفته</p>
        </Card>
        <Card className="flex flex-col items-center gap-2 py-4">
          <Dumbbell className="w-5 h-5 text-info" />
          <p className="text-xl font-bold text-text">{gymPlan.length}</p>
          <p className="text-[10px] text-muted">تمرین</p>
        </Card>
      </div>

      {/* Today's Session */}
      {todayIsGymDay && (
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Dumbbell className="w-4 h-4 text-accent" />
              برنامه امروز
            </CardTitle>
            {todayStat?.gymSession ? (
              <Badge variant="success">انجام شده</Badge>
            ) : (
              <Badge variant="warning">در انتظار</Badge>
            )}
          </CardHeader>
          {gymPlan.length > 0 ? (
            <div className="space-y-2 mb-4">
              {gymPlan.map((exercise) => (
                <div key={exercise} className="flex items-center gap-2 text-sm text-text">
                  <CheckCircle2 className={`w-4 h-4 ${todayStat?.gymSession ? 'text-success' : 'text-muted'}`} />
                  {exercise}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted mb-4">تمرینی تعریف نشده. از بخش پایین اضافه کن.</p>
          )}
          <Button
            variant={todayStat?.gymSession ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => toggleGymSession()}
          >
            {todayStat?.gymSession ? 'لغو ثبت' : 'ثبت باشگاه امروز'}
          </Button>
        </Card>
      )}

      {/* Gym Days */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Calendar className="w-4 h-4" />
            روزهای باشگاه
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const isActive = gymDays.includes(day.index);
            return (
              <button
                key={day.index}
                onClick={() => handleToggleDay(day.index)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border hover:border-muted bg-surface-hover text-muted'
                  }
                `}
              >
                <span className="text-lg font-bold">{day.short}</span>
                <span className="text-[9px]">{day.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Exercises */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Dumbbell className="w-4 h-4" />
            تمرینات
          </CardTitle>
          <Badge variant="default">{gymPlan.length}</Badge>
        </CardHeader>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="تمرین جدید اضافه کن..."
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddExercise()}
              className="flex-1"
            />
            <Button variant="primary" size="sm" onClick={handleAddExercise} disabled={!newExercise.trim()}>
              <Plus className="w-4 h-4" />
              اضافه
            </Button>
          </div>

          <div className="space-y-1.5">
            {gymPlan.map((exercise) => (
              <div
                key={exercise}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-hover group"
              >
                <span className="text-sm text-text">{exercise}</span>
                <button
                  onClick={() => handleRemoveExercise(exercise)}
                  className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {gymPlan.length === 0 && (
              <p className="text-center text-muted text-sm py-4">
                تمرینی اضافه نشده.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <CheckCircle2 className="w-4 h-4" />
            تاریخچه باشگاه
          </CardTitle>
        </CardHeader>
        {gymHistory.length > 0 ? (
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5">
            {gymHistory.map((stat) => (
              <div
                key={stat.date}
                className="aspect-square rounded-lg bg-success/10 flex items-center justify-center"
                title={stat.date}
              >
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted text-sm py-4">
            هنوز جلسه باشگاهی ثبت نشده.
          </p>
        )}
      </Card>
    </div>
  );
}
