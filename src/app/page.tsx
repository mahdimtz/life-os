'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Flame,
  Target,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Dumbbell,
  Zap,
  Plus,
  Clock,
  Calendar,
  NotebookPen,
  CalendarDays,
} from 'lucide-react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'صبح بخیر';
  if (h < 18) return 'عصر بخیر';
  return 'شب بخیر';
}

function getPriorityColor(p: string) {
  if (p === 'high') return 'danger';
  if (p === 'medium') return 'warning';
  return 'default';
}

const CHART_COLORS = {
  bar: '#818cf8',
  barBg: 'rgba(129, 140, 248, 0.15)',
  grid: '#27272a',
  text: '#52525b',
};

export default function Dashboard() {
  const tasks = useAppStore((s) => s.tasks);
  const goals = useAppStore((s) => s.goals);
  const dailyStats = useAppStore((s) => s.dailyStats);
  const identityVotes = useAppStore((s) => s.identityVotes);
  const identityValues = useAppStore((s) => s.settings.identityValues);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const addIdentityVote = useAppStore((s) => s.addIdentityVote);
  const getTodayTasks = useAppStore((s) => s.getTodayTasks);
  const getTomorrowTasks = useAppStore((s) => s.getTomorrowTasks);
  const getTodayScore = useAppStore((s) => s.getTodayScore);
  const getStreak = useAppStore((s) => s.getStreak);
  const getIdentityScore = useAppStore((s) => s.getIdentityScore);
  const getWeeklyStats = useAppStore((s) => s.getWeeklyStats);
  const getTodayLearningHours = useAppStore((s) => s.getTodayLearningHours);

  const todayTasks = useMemo(() => getTodayTasks(), [tasks]);
  const tomorrowTasks = useMemo(() => getTomorrowTasks(), [tasks]);
  const todayScore = useMemo(() => getTodayScore(), [tasks]);
  const streak = useMemo(() => getStreak(), [dailyStats]);
  const identityScore = useMemo(() => getIdentityScore(), [identityVotes]);
  const weeklyStats = useMemo(() => getWeeklyStats(), [dailyStats]);
  const todayLearningHours = useMemo(() => getTodayLearningHours(), [tasks]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayStat = useMemo(
    () => dailyStats.find((s) => s.date === todayStr),
    [dailyStats]
  );

  const mainMission = useMemo(
    () =>
      todayTasks
        .filter((t) => !t.completed)
        .sort((a, b) => {
          const order = { high: 0, medium: 1, low: 2 };
          return order[a.priority] - order[b.priority];
        })[0] ?? null,
    [todayTasks]
  );

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const todayData = useMemo(
    () =>
      weeklyStats.map((s) => ({
        ...s,
        label: new Date(s.date).toLocaleDateString('fa-IR', { weekday: 'short' }),
      })),
    [weeklyStats]
  );

  return (
    <div className="min-h-screen px-2 sm:px-6 py-6 sm:py-10 max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
          {getGreeting()}، علی
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          {new Date().toLocaleDateString('fa-IR', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </header>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-5">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-warning/10">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-text">{streak}</p>
            <p className="text-[10px] sm:text-xs text-muted mt-0.5">روز متوالی</p>
          </div>
        </Card>

        <Card className="flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-5">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-text">{todayScore}%</p>
            <p className="text-[10px] sm:text-xs text-muted mt-0.5">امتیاز امروز</p>
          </div>
        </Card>

        <Card className="flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-5">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-success/10">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-text">{identityScore}%</p>
            <p className="text-[10px] sm:text-xs text-muted mt-0.5">عمل به هویت</p>
          </div>
        </Card>

        <Card className="flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-5">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-info/10">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-text">
              {completedCount}/{todayTasks.length}
            </p>
            <p className="text-[10px] sm:text-xs text-muted mt-0.5">وظایف انجام شده</p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Left: Mission + Tasks */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {mainMission && (
            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Zap className="w-4 h-4 text-accent" />
                  مأموریت اصلی
                </CardTitle>
                <Badge variant="danger">اولویت بالا</Badge>
              </CardHeader>
              <p className="text-base sm:text-lg font-medium text-text mb-2">
                {mainMission.title}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {mainMission.estimatedMinutes} دقیقه
                </span>
                {mainMission.goalId && (
                  (() => {
                    const goal = goals.find((g) => g.id === mainMission.goalId);
                    return goal ? (
                      <Badge variant="info">
                        <Target className="w-3 h-3 ml-1" />
                        {goal.title}
                      </Badge>
                    ) : null;
                  })()
                )}
              </div>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">وظایف امروز</CardTitle>
              <span className="text-xs text-muted">
                {completedCount} از {todayTasks.length} انجام شده
              </span>
            </CardHeader>

            <Progress
              value={todayTasks.length > 0 ? (completedCount / todayTasks.length) * 100 : 0}
              color={todayScore >= 70 ? 'success' : todayScore >= 40 ? 'warning' : 'danger'}
              size="sm"
              className="mb-4"
            />

            <div className="space-y-1">
              {todayTasks.map((task) => (
                <label
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer group
                    ${task.completed ? 'opacity-50' : 'hover:bg-surface-hover'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="sr-only"
                  />
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center
                      ${task.completed
                        ? 'bg-success border-success'
                        : 'border-border group-hover:border-accent'
                      }
                    `}
                  >
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted' : 'text-text'}`}>
                      {task.title}
                    </p>
                    {task.goalId && (() => {
                      const goal = goals.find((g) => g.id === task.goalId);
                      return goal ? (
                        <span className="text-[10px] text-accent flex items-center gap-1 mt-0.5">
                          <Target className="w-2.5 h-2.5" />
                          {goal.title}
                        </span>
                      ) : null;
                    })()}
                  </div>

                  <Badge variant={getPriorityColor(task.priority) as 'default' | 'danger' | 'warning'}>
                    {task.priority === 'high' ? 'بالا' : task.priority === 'medium' ? 'متوسط' : 'پایین'}
                  </Badge>

                  <span className="text-xs text-muted hidden sm:flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.estimatedMinutes}د
                  </span>
                </label>
              ))}

              {todayTasks.length === 0 && (
                <p className="text-center text-muted text-sm py-8">
                  وظیفه‌ای برای امروز نیست. از وقت آزادت لذت ببر.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Tomorrow's Plan */}
          <Card className="border-info/20 bg-info/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <CalendarDays className="w-4 h-4 text-info" />
                برنامه فردا
              </CardTitle>
              <span className="text-xs text-muted">
                {tomorrowTasks.length} وظیفه
              </span>
            </CardHeader>
            {tomorrowTasks.length > 0 ? (
              <div className="space-y-1.5">
                {tomorrowTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full ${task.completed ? 'bg-success' : 'bg-muted'}`} />
                    <span className={`${task.completed ? 'line-through text-muted' : 'text-text'}`}>
                      {task.title}
                    </span>
                    <Badge variant={getPriorityColor(task.priority) as 'default' | 'danger' | 'warning'} className="text-[9px]">
                      {task.priority === 'high' ? 'بالا' : task.priority === 'medium' ? 'متوسط' : 'پایین'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">
                هنوز برنامه‌ای برای فردا نداری.
              </p>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="w-4 h-4" />
                نمای هفتگی
              </CardTitle>
            </CardHeader>

            {todayData.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={todayData} barCategoryGap="30%">
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: CHART_COLORS.text }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: CHART_COLORS.text }}
                      width={30}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#18181b',
                        border: '1px solid #27272a',
                        borderRadius: '12px',
                        fontSize: 12,
                        color: '#fafafa',
                      }}
                      cursor={{ fill: CHART_COLORS.barBg }}
                    />
                    <Bar
                      dataKey="score"
                      fill={CHART_COLORS.bar}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted text-sm py-8">
                ردیابی رو شروع کن تا نمودار هفتگی ببینی.
              </p>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">پیشرفت</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm text-text">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    وظایف انجام شده
                  </span>
                  <span className="text-xs text-muted">{completedCount}/{todayTasks.length}</span>
                </div>
                <Progress
                  value={todayTasks.length > 0 ? (completedCount / todayTasks.length) * 100 : 0}
                  color="success"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm text-text">
                    <BookOpen className="w-4 h-4 text-info" />
                    ساعت مطالعه
                  </span>
                  <span className="text-xs text-muted">{todayLearningHours.toFixed(1)} ساعت امروز</span>
                </div>
                <Progress value={Math.min(100, (todayLearningHours / 8) * 100)} color="accent" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm text-text">
                    <Dumbbell className="w-4 h-4 text-warning" />
                    جلسه باشگاه
                  </span>
                  <span className="text-xs text-muted">
                    {todayStat?.gymSession ? 'انجام شده' : 'در انتظار'}
                  </span>
                </div>
                <Progress
                  value={todayStat?.gymSession ? 100 : 0}
                  color="warning"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm text-text">
                    <NotebookPen className="w-4 h-4 text-accent" />
                    ژورنال امروز
                  </span>
                  <span className="text-xs text-muted">
                    {todayStat?.journalWritten ? 'نوشته شده' : 'در انتظار'}
                  </span>
                </div>
                <Progress
                  value={todayStat?.journalWritten ? 100 : 0}
                  color="accent"
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp className="w-4 h-4" />
                رأی هویت
              </CardTitle>
            </CardHeader>
            <p className="text-xs text-muted mb-3">
              هر بار که طبق ارزشت عمل می‌کنی یه رأی بذار. امتیاز = درصد اعمال هویتی در ۳۰ روز اخیر.
            </p>
            <div className="flex flex-wrap gap-2">
              {identityValues.map((value) => (
                <Button
                  key={value}
                  variant="secondary"
                  size="sm"
                  onClick={() => addIdentityVote(`عمل با ${value}`, value)}
                  className="group"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
                  {value}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
