'use client';

import { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  Trash2,
  Calendar,
  Clock,
  TrendingUp,
  Zap,
  X,
  Pencil,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Goal } from '@/types';

const TIMEFRAMES = [
  { value: '1year', label: '۱ سال', icon: Zap, color: 'warning' as const },
  { value: '3years', label: '۳ سال', icon: TrendingUp, color: 'info' as const },
  { value: '5years', label: '۵ سال', icon: Target, color: 'success' as const },
] as const;

type TimeframeFilter = 'all' | Goal['timeframe'];

function getDaysUntil(date: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fa-IR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getProgressColor(progress: number): 'danger' | 'warning' | 'accent' | 'success' {
  if (progress < 25) return 'danger';
  if (progress < 50) return 'warning';
  if (progress < 75) return 'accent';
  return 'success';
}

function getDeadlineStatus(days: number): { label: string; variant: 'danger' | 'warning' | 'success' } {
  if (days < 0) return { label: 'گذشته', variant: 'danger' };
  if (days < 30) return { label: `${days} روز مانده`, variant: 'warning' };
  if (days < 90) return { label: `${Math.ceil(days / 30)} ماه مانده`, variant: 'warning' };
  return { label: `${Math.ceil(days / 30)} ماه مانده`, variant: 'success' };
}

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (id: string, progress: number) => void;
  onDelete: (id: string) => void;
}

function GoalCard({ goal, onUpdateProgress, onDelete }: GoalCardProps) {
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState(goal.progress);
  const days = getDaysUntil(goal.deadline);
  const deadlineStatus = getDeadlineStatus(days);
  const progressColor = getProgressColor(goal.progress);

  const handleSaveProgress = () => {
    onUpdateProgress(goal.id, tempProgress);
    setIsEditingProgress(false);
  };

  return (
    <Card className="group hover:border-accent/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Target size={16} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm sm:text-base text-text truncate">{goal.title}</CardTitle>
            <p className="text-[10px] sm:text-xs text-muted mt-1 line-clamp-2">{goal.description}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(goal.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-danger"
        >
          <Trash2 size={14} />
        </Button>
      </CardHeader>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-muted">پیشرفت</span>
          {isEditingProgress ? (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                value={tempProgress}
                onChange={(e) => setTempProgress(Number(e.target.value))}
                className="w-20 h-1 bg-border rounded-full appearance-none cursor-pointer accent-accent"
              />
              <span className="text-xs font-medium text-accent w-8 text-right">{tempProgress}%</span>
              <button onClick={handleSaveProgress} className="text-xs text-success hover:text-success/80">
                ذخیره
              </button>
              <button
                onClick={() => { setTempProgress(goal.progress); setIsEditingProgress(false); }}
                className="text-xs text-muted hover:text-text"
              >
                انصراف
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setTempProgress(goal.progress); setIsEditingProgress(true); }}
              className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
            >
              <span>{goal.progress}%</span>
              <Pencil size={10} />
            </button>
          )}
        </div>
        <Progress value={goal.progress} color={progressColor} size="md" />
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted">
          <Calendar size={12} />
          <span>{formatDate(goal.deadline)}</span>
        </div>
        <Badge variant={deadlineStatus.variant}>
          <Clock size={10} className="mr-1" />
          {deadlineStatus.label}
        </Badge>
      </div>
    </Card>
  );
}

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, timeframe: Goal['timeframe'], deadline: string) => void;
}

function AddGoalModal({ isOpen, onClose, onAdd }: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeframe, setTimeframe] = useState<Goal['timeframe']>('1year');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  const validate = (): boolean => {
    const newErrors: { title?: string; deadline?: string } = {};
    if (!title.trim()) newErrors.title = 'عنوان الزامی است';
    if (!deadline) newErrors.deadline = 'مهلت الزامی است';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd(title.trim(), description.trim(), timeframe, deadline);
    setTitle(''); setDescription(''); setTimeframe('1year'); setDeadline(''); setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-surface border border-border rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Plus size={16} className="text-accent" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-text">هدف جدید</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-text hover:bg-surface-hover transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <Input label="عنوان هدف" placeholder="مثال: تسلط بر React و Next.js" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
          <Textarea label="توضیحات" placeholder="موفقیت چه شکلیه؟" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          <Select label="بازه زمانی" value={timeframe} onChange={(e) => setTimeframe(e.target.value as Goal['timeframe'])} options={TIMEFRAMES.map((t) => ({ value: t.value, label: t.label }))} />
          <Input label="مهلت" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} error={errors.deadline} />
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>انصراف</Button>
            <Button type="submit" variant="primary"><Plus size={16} /> ایجاد هدف</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const goals = useAppStore((s) => s.goals);
  const addGoal = useAppStore((s) => s.addGoal);
  const updateGoalProgress = useAppStore((s) => s.updateGoalProgress);
  const deleteGoal = useAppStore((s) => s.deleteGoal);
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframeFilter>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredGoals = useMemo(() => {
    if (activeTimeframe === 'all') return goals;
    return goals.filter((g) => g.timeframe === activeTimeframe);
  }, [goals, activeTimeframe]);

  const groupedGoals = useMemo(() => {
    if (activeTimeframe !== 'all') return null;
    return TIMEFRAMES.map((t) => ({
      ...t,
      goals: goals.filter((g) => g.timeframe === t.value),
    }));
  }, [goals, activeTimeframe]);

  const stats = useMemo(() => {
    const total = goals.length;
    const avgProgress = total > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / total) : 0;
    const completed = goals.filter((g) => g.progress === 100).length;
    return { total, avgProgress, completed };
  }, [goals]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">اهداف</h1>
          <p className="text-muted mt-1 text-xs sm:text-sm">دید بلندمدت و نقاط عطفت رو دنبال کن</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} size="lg">
          <Plus size={18} /> هدف جدید
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="flex items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Target size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-lg sm:text-2xl font-bold text-text">{stats.total}</p>
            <p className="text-[10px] sm:text-xs text-muted">کل اهداف</p>
          </div>
        </Card>
        <Card className="flex items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-info/10 flex items-center justify-center">
            <TrendingUp size={18} className="text-info" />
          </div>
          <div>
            <p className="text-lg sm:text-2xl font-bold text-text">{stats.avgProgress}%</p>
            <p className="text-[10px] sm:text-xs text-muted">میانگین</p>
          </div>
        </Card>
        <Card className="flex items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-success/10 flex items-center justify-center">
            <Zap size={18} className="text-success" />
          </div>
          <div>
            <p className="text-lg sm:text-2xl font-bold text-text">{stats.completed}</p>
            <p className="text-[10px] sm:text-xs text-muted">تکمیل شده</p>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 p-1 bg-surface border border-border rounded-xl w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTimeframe('all')}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
            activeTimeframe === 'all' ? 'bg-accent text-white' : 'text-muted hover:text-text hover:bg-surface-hover'
          }`}
        >
          همه اهداف
        </button>
        {TIMEFRAMES.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTimeframe(t.value)}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTimeframe === t.value ? 'bg-accent text-white' : 'text-muted hover:text-text hover:bg-surface-hover'
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {activeTimeframe === 'all' && groupedGoals ? (
        <div className="space-y-8 sm:space-y-10">
          {groupedGoals.map((group) => (
            <section key={group.value}>
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-surface-hover flex items-center justify-center">
                  <group.icon size={14} className="text-muted" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-text">{group.label}</h2>
                <Badge variant="default">{group.goals.length}</Badge>
              </div>
              {group.goals.length === 0 ? (
                <EmptyState
                  icon={group.icon}
                  title={`هنوز هدفی برای ${group.label} نداری`}
                  description="یه هدف با این بازه زمانی تعیین کن"
                  action={
                    <Button variant="secondary" size="sm" onClick={() => { setActiveTimeframe(group.value); setIsAddModalOpen(true); }}>
                      <Plus size={14} /> اضافه کردن
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.goals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} onUpdateProgress={updateGoalProgress} onDelete={deleteGoal} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      ) : filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="هنوز هدفی نداری"
          description="یه هدف تعیین کن تا پیشرفتت رو دنبال کنی"
          action={<Button onClick={() => setIsAddModalOpen(true)}><Plus size={16} /> اولین هدفت رو بساز</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onUpdateProgress={updateGoalProgress} onDelete={deleteGoal} />
          ))}
        </div>
      )}

      <AddGoalModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addGoal} />
    </div>
  );
}
