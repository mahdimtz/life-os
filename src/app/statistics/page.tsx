'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  CheckCircle2, BookOpen, Dumbbell, BookMarked, Flame, TrendingUp, Calendar, Brain, Activity,
} from 'lucide-react';

const ACCENT = '#818cf8';
const ACCENT_BG = 'rgba(129, 140, 248, 0.15)';
const SUCCESS = '#4ade80';
const WARNING = '#fbbf24';
const INFO = '#60a5fa';
const TEXT = '#52525b';

const MOOD_COLORS: Record<string, string> = { great: SUCCESS, good: ACCENT, neutral: INFO, bad: WARNING, terrible: '#f87171' };
const CATEGORY_COLORS: Record<string, string> = { backend: ACCENT, frontend: INFO, english: SUCCESS, books: WARNING };

const tooltipStyle = { background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: 12, color: '#fafafa' };

export default function StatisticsPage() {
  const tasks = useAppStore((s) => s.tasks);
  const learningEntries = useAppStore((s) => s.learningEntries);
  const dailyStats = useAppStore((s) => s.dailyStats);
  const journalEntries = useAppStore((s) => s.journalEntries);
  const getStreak = useAppStore((s) => s.getStreak);
  const getWeeklyStats = useAppStore((s) => s.getWeeklyStats);

  const totalTasksCompleted = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const totalStudyHours = useMemo(() => learningEntries.reduce((sum, e) => sum + e.hours, 0), [learningEntries]);
  const gymSessions = useMemo(() => dailyStats.filter((s) => s.gymSession).length, [dailyStats]);
  const journalCount = journalEntries.length;
  const streak = getStreak();

  const weeklyStats = useMemo(() => getWeeklyStats(), [dailyStats]);

  const weeklyTaskData = useMemo(() => weeklyStats.map((s) => ({
    label: new Date(s.date).toLocaleDateString('fa-IR', { weekday: 'short' }),
    completed: s.tasksCompleted, total: s.totalTasks, score: s.score,
  })), [weeklyStats]);

  const studyTrendData = useMemo(() => {
    const last14 = [...dailyStats].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
    return last14.map((s) => ({
      label: new Date(s.date).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
      hours: s.studyHours,
    }));
  }, [dailyStats]);

  const moodData = useMemo(() => {
    const counts: Record<string, number> = { great: 0, good: 0, neutral: 0, bad: 0, terrible: 0 };
    journalEntries.forEach((e) => { if (counts[e.mood] !== undefined) counts[e.mood]++; });
    return Object.entries(counts).filter(([, v]) => v > 0).map(([mood, count]) => ({ mood, count }));
  }, [journalEntries]);

  const moodTrendData = useMemo(() => {
    const moodValues: Record<string, number> = { great: 5, good: 4, neutral: 3, bad: 2, terrible: 1 };
    return [...journalEntries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)
      .map((e) => ({
        date: new Date(e.date).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
        mood: moodValues[e.mood] ?? 3,
        label: e.mood,
      }));
  }, [journalEntries]);

  const learningData = useMemo(() => {
    const cats: Record<string, number> = {};
    learningEntries.forEach((e) => { cats[e.category] = (cats[e.category] || 0) + e.hours; });
    return Object.entries(cats).map(([category, hours]) => ({ category, hours }));
  }, [learningEntries]);

  const maxMoodCount = useMemo(() => Math.max(1, ...moodData.map((d) => d.count)), [moodData]);

  return (
    <div className="min-h-screen px-2 sm:px-6 py-6 sm:py-10 max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">آمار</h1>
        <p className="text-muted text-xs sm:text-sm">معیارهای زندگیت در یک نگاه</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card className="flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-5">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-success/10">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-text">{totalTasksCompleted}</p>
            <p className="text-[10px] sm:text-xs text-muted mt-0.5">وظایف انجام شده</p>
          </div>
        </Card>

        <Card className="flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-5">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-info/10">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-text">{totalStudyHours.toFixed(1)}h</p>
            <p className="text-[10px] sm:text-xs text-muted mt-0.5">ساعت مطالعه</p>
          </div>
        </Card>

        <Card className="flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-5">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-warning/10">
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-text">{gymSessions}</p>
            <p className="text-[10px] sm:text-xs text-muted mt-0.5">جلسه باشگاه</p>
          </div>
        </Card>

        <Card className="flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-5">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10">
            <BookMarked className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-text">{journalCount}</p>
            <p className="text-[10px] sm:text-xs text-muted mt-0.5">ورودی ژورنال</p>
          </div>
        </Card>
      </div>

      <Card className="border-accent/20 bg-accent/5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-warning/10">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-text">{streak}</p>
            <p className="text-xs sm:text-sm text-muted">روز متوالی — ادامه بده</p>
          </div>
          <div className="ml-auto">
            <Badge variant={streak >= 7 ? 'success' : streak >= 3 ? 'warning' : 'default'}>
              {streak >= 7 ? 'آتشین' : streak >= 3 ? 'در حال ساختن' : 'شروع کردن'}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Calendar className="w-4 h-4" /> تکمیل وظایف هفتگی
            </CardTitle>
          </CardHeader>
          {weeklyTaskData.length > 0 ? (
            <div className="h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTaskData} barCategoryGap="25%">
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: TEXT }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: TEXT }} width={30} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: ACCENT_BG }} />
                  <Bar dataKey="completed" fill={ACCENT} radius={[6, 6, 0, 0]} name="انجام شده" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted text-sm py-8">وظایف رو شروع کن تا نمودار ببینی.</p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp className="w-4 h-4" /> روند ساعت مطالعه
            </CardTitle>
          </CardHeader>
          {studyTrendData.length > 0 ? (
            <div className="h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studyTrendData}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: TEXT }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: TEXT }} width={30} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="hours" stroke={ACCENT} strokeWidth={2.5} dot={{ r: 4, fill: ACCENT, strokeWidth: 0 }} activeDot={{ r: 6, fill: ACCENT }} name="ساعت" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted text-sm py-8">یادگیری رو شروع کن تا ساعت‌ها رو ببینی.</p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Activity className="w-4 h-4" /> روند احساسات
            </CardTitle>
          </CardHeader>
          {moodTrendData.length > 0 ? (
            <div className="h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodTrendData}>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: TEXT }} />
                  <YAxis
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(v: number) => {
                      const labels: Record<number, string> = { 1: 'خیلی بد', 2: 'بد', 3: 'معمولی', 4: 'خوب', 5: 'عالی' };
                      return labels[v] || '';
                    }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: TEXT }}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => {
                      const labels: Record<number, string> = { 1: 'خیلی بد', 2: 'بد', 3: 'معمولی', 4: 'خوب', 5: 'عالی' };
                      return [labels[value as number] || value, 'احساس'];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke={ACCENT}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: ACCENT, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: ACCENT }}
                    name="احساس"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted text-sm py-8">ژورنال بنویس تا روند احساساتت رو ببینی.</p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <BookOpen className="w-4 h-4" /> یادگیری بر اساس دسته
            </CardTitle>
          </CardHeader>
          {learningData.length > 0 ? (
            <div className="h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={learningData} barCategoryGap="30%">
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: TEXT }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: TEXT }} width={30} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: ACCENT_BG }} />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]} name="ساعت">
                    {learningData.map((entry) => (
                      <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || ACCENT} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted text-sm py-8">جلسات یادگیری رو ثبت کن تا تفکیک ببینی.</p>
          )}
        </Card>
      </div>

      {weeklyStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp className="w-4 h-4" /> امتیاز روزانه — ۷ روز اخیر
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weeklyStats.map((s) => (
              <div key={s.date} className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div className="text-[10px] sm:text-xs text-muted">{new Date(s.date).toLocaleDateString('fa-IR', { weekday: 'short' })}</div>
                <div className="w-full aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold"
                  style={{
                    backgroundColor: s.score >= 80 ? 'rgba(74, 222, 128, 0.15)' : s.score >= 50 ? 'rgba(129, 140, 248, 0.15)' : s.score >= 30 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                    color: s.score >= 80 ? SUCCESS : s.score >= 50 ? ACCENT : s.score >= 30 ? WARNING : '#f87171',
                  }}>
                  {s.score}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
