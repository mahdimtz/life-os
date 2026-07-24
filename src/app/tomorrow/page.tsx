'use client';

import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  CalendarDays,
  Target,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Priority } from '@/types';

const PRIORITY_CONFIG: Record<Priority, { badge: 'danger' | 'warning' | 'success'; label: string }> = {
  high: { badge: 'danger', label: 'بالا' },
  medium: { badge: 'warning', label: 'متوسط' },
  low: { badge: 'success', label: 'پایین' },
};

const PRIORITY_OPTIONS: Priority[] = ['high', 'medium', 'low'];

function formatDuration(min: number): string {
  if (min < 60) return `${min}د`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}س ${m}د` : `${h}س`;
}

function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function getTomorrowLabel(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString('fa-IR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TomorrowPage() {
  const getTomorrowTasks = useAppStore((s) => s.getTomorrowTasks);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const addTask = useAppStore((s) => s.addTask);
  const allStoreTasks = useAppStore((s) => s.tasks);
  const goals = useAppStore((s) => s.goals);

  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newMinutes, setNewMinutes] = useState(30);
  const [newGoalId, setNewGoalId] = useState<string>('');
  const [showAdd, setShowAdd] = useState(false);

  const allTasks = useMemo(() => getTomorrowTasks(), [allStoreTasks]);
  const completedCount = allTasks.filter((t) => t.completed).length;
  const totalEstimated = allTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  const tasks = useMemo(() => {
    return [...allTasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });
  }, [allTasks]);

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    addTask(trimmed, newPriority, newMinutes, undefined, newGoalId || undefined, getTomorrowDate());
    setNewTitle('');
    setNewPriority('medium');
    setNewMinutes(30);
    setNewGoalId('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted">
            <CalendarDays size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">برنامه فردا</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-text">{getTomorrowLabel()}</h1>
          <p className="text-xs sm:text-sm text-muted">
            {completedCount}/{allTasks.length} وظیفه انجام شده
            {totalEstimated > 0 && ` · ${formatDuration(totalEstimated)} تخمین`}
          </p>
        </div>

        {/* Task List */}
        {tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task) => {
              const cfg = PRIORITY_CONFIG[task.priority];
              const goal = task.goalId ? goals.find((g) => g.id === task.goalId) : null;
              return (
                <Card
                  key={task.id}
                  className={`!p-3 sm:!p-4 group transition-all duration-200 ${
                    task.completed ? 'opacity-50' : 'hover:border-border/60'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-110"
                    >
                      {task.completed ? (
                        <CheckCircle2 size={18} className="text-success" />
                      ) : (
                        <Circle size={18} className="text-muted hover:text-accent" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-medium transition-all duration-200 ${
                          task.completed ? 'line-through text-muted' : 'text-text'
                        }`}
                      >
                        {task.title}
                      </p>
                      {goal && (
                        <span className="text-[10px] text-accent flex items-center gap-1 mt-0.5">
                          <Target className="w-2.5 h-2.5" />
                          {goal.title}
                        </span>
                      )}
                    </div>

                    <Badge variant={cfg.badge} className="flex-shrink-0 text-[10px]">
                      {cfg.label}
                    </Badge>

                    <div className="flex items-center gap-1 text-muted flex-shrink-0">
                      <Clock size={10} />
                      <span className="text-[10px] sm:text-xs">{formatDuration(task.estimatedMinutes)}</span>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-all duration-200 cursor-pointer flex-shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title="هنوز برنامه‌ای برای فردا نداری"
            description=" الان بهترین زمانه که فردا رو برنامه‌ریزی کنی."
            action={
              <Button onClick={() => setShowAdd(true)}>
                <Plus size={16} /> اضافه کردن
              </Button>
            }
          />
        )}

        {/* Add Task */}
        {showAdd ? (
          <Card className="!p-3 sm:!p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-text">وظیفه جدید برای فردا</span>
              <button
                onClick={() => setShowAdd(false)}
                className="text-xs text-muted hover:text-text-secondary cursor-pointer"
              >
                انصراف
              </button>
            </div>

            <Input
              placeholder="چه کاری باید فردا انجام بشه؟"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />

            <div className="flex items-end gap-2 sm:gap-3">
              <div className="flex-1">
                <label className="text-[10px] sm:text-xs font-medium text-text-secondary mb-1.5 block">اولویت</label>
                <div className="flex gap-1 sm:gap-1.5">
                  {PRIORITY_OPTIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewPriority(p)}
                      className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                        newPriority === p
                          ? 'bg-accent/15 text-accent ring-1 ring-accent/30'
                          : 'bg-surface text-muted hover:text-text-secondary hover:bg-surface-hover'
                      }`}
                    >
                      {PRIORITY_CONFIG[p].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-20 sm:w-24">
                <label className="text-[10px] sm:text-xs font-medium text-text-secondary mb-1.5 block">دقیقه</label>
                <input
                  type="number"
                  min={5}
                  max={480}
                  step={5}
                  value={newMinutes}
                  onChange={(e) => setNewMinutes(Number(e.target.value))}
                  className="w-full px-2 sm:px-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
              </div>

              <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim()}>
                <Plus size={14} /> اضافه
              </Button>
            </div>

            {/* Goal selector */}
            {goals.length > 0 && (
              <div>
                <label className="text-[10px] sm:text-xs font-medium text-text-secondary mb-1.5 block">مرتبط با هدف (اختیاری)</label>
                <select
                  value={newGoalId}
                  onChange={(e) => setNewGoalId(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                >
                  <option value="">بدون هدف</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>
            )}
          </Card>
        ) : (
          allTasks.length > 0 && (
            <Button variant="secondary" className="w-full" onClick={() => setShowAdd(true)}>
              <Plus size={16} /> اضافه کردن وظیفه
            </Button>
          )
        )}
      </div>
    </div>
  );
}
