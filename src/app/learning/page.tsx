'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  BookOpen, Code, Globe, BookMarked, Plus, Clock, TrendingUp, Trash2, Calendar,
} from 'lucide-react';
import type { LearningEntry } from '@/types';

const CATEGORIES = [
  { id: 'backend' as const, label: 'بک‌اند', icon: Code, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', badge: 'info' as const },
  { id: 'frontend' as const, label: 'فرانت‌اند', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', badge: 'warning' as const },
  { id: 'english' as const, label: 'انگلیسی', icon: Globe, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', badge: 'success' as const },
  { id: 'books' as const, label: 'کتاب', icon: BookMarked, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', badge: 'default' as const },
];

export default function LearningPage() {
  const learningEntries = useAppStore((s) => s.learningEntries);
  const addLearningEntry = useAppStore((s) => s.addLearningEntry);
  const deleteLearningEntry = useAppStore((s) => s.deleteLearningEntry);
  const getLearningHours = useAppStore((s) => s.getLearningHours);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<LearningEntry['category']>('backend');
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');

  const totalHours = useMemo(() => learningEntries.reduce((sum, e) => sum + e.hours, 0), [learningEntries]);
  const categoryHours = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of CATEGORIES) map[cat.id] = getLearningHours(cat.id);
    return map;
  }, [learningEntries]);
  const maxHours = useMemo(() => Math.max(...Object.values(categoryHours), 1), [categoryHours]);
  const sortedEntries = useMemo(() => [...learningEntries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)), [learningEntries]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const h = parseFloat(hours);
    if (!title.trim() || isNaN(h) || h <= 0) return;
    addLearningEntry(category, title.trim(), h, notes.trim() || undefined);
    setTitle(''); setHours(''); setNotes(''); setShowForm(false);
  }

  return (
    <div className="min-h-screen px-2 sm:px-6 py-6 sm:py-10 max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">یادگیری</h1>
          <p className="text-muted text-xs sm:text-sm">ساعت مطالعه در همه دسته‌بندی‌ها رو دنبال کن</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> ثبت
        </Button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const hours_ = categoryHours[cat.id];
          return (
            <Card key={cat.id} className={`flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-5 border ${cat.border}`}>
              <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${cat.bg}`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${cat.color}`} />
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-text">{hours_.toFixed(1)}</p>
                <p className="text-[10px] sm:text-xs text-muted mt-0.5">{cat.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {showForm && (
            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Plus className="w-4 h-4 text-accent" /> ثبت یادگیری
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>انصراف</Button>
              </CardHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select label="دسته‌بندی" value={category} onChange={(e) => setCategory(e.target.value as LearningEntry['category'])} options={CATEGORIES.map((c) => ({ value: c.id, label: c.label }))} />
                  <Input label="ساعت" type="number" step="0.5" min="0.5" placeholder="2.5" value={hours} onChange={(e) => setHours(e.target.value)} required />
                </div>
                <Input label="عنوان" placeholder="چه چیزی یاد گرفتی؟" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <Textarea label="یادداشت (اختیاری)" placeholder="نکات کلیدی..." rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                <div className="flex justify-end gap-2">
                  <Button type="submit">ذخیره</Button>
                </div>
              </form>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp className="w-4 h-4" /> توزیع ساعت
              </CardTitle>
              <span className="text-xs text-muted">{totalHours.toFixed(1)} ساعت کل</span>
            </CardHeader>
            <div className="space-y-3 sm:space-y-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const h = categoryHours[cat.id];
                const pct = maxHours > 0 ? (h / maxHours) * 100 : 0;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-2 text-xs sm:text-sm text-text">
                        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${cat.color}`} /> {cat.label}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted">{h.toFixed(1)}h</span>
                    </div>
                    <div className="w-full bg-border rounded-full overflow-hidden h-1.5 sm:h-2">
                      <div className={`h-full rounded-full transition-all duration-500 ease-out ${cat.color.replace('text-', 'bg-')}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="w-4 h-4" /> آخرین ثبت‌ها
              </CardTitle>
              <span className="text-xs text-muted">{sortedEntries.length} مورد</span>
            </CardHeader>
            {sortedEntries.length === 0 ? (
              <EmptyState icon={BookOpen} title="هنوز یادگیری ثبت نشده" description="ساعت مطالعه‌ات رو ثبت کن تا پیشرفتت رو ببینی." />
            ) : (
              <div className="space-y-1">
                {sortedEntries.map((entry) => {
                  const cat = CATEGORIES.find((c) => c.id === entry.category);
                  return (
                    <div key={entry.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-surface-hover transition-colors group">
                      <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${cat?.bg ?? 'bg-muted/10'}`}>
                        {cat && <cat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${cat.color}`} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-text truncate">{entry.title}</p>
                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted mt-0.5">
                          <Clock className="w-3 h-3" />
                          {entry.hours}h<span>·</span>
                          <span>{entry.date}</span>
                          {entry.notes && <><span>·</span><span className="truncate max-w-[120px] sm:max-w-[200px]">{entry.notes}</span></>}
                        </div>
                      </div>
                      <Badge variant={cat?.badge} className="text-[10px]">{entry.category}</Badge>
                      <button onClick={() => deleteLearningEntry(entry.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-all">
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Clock className="w-4 h-4" /> خلاصه
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-surface-hover">
                <span className="text-xs sm:text-sm text-text-secondary">ساعت کل</span>
                <span className="text-base sm:text-lg font-bold text-text">{totalHours.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-surface-hover">
                <span className="text-xs sm:text-sm text-text-secondary">تعداد ثبت</span>
                <span className="text-base sm:text-lg font-bold text-text">{learningEntries.length}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-surface-hover">
                <span className="text-xs sm:text-sm text-text-secondary">بیشترین مطالعه</span>
                <span className="text-xs sm:text-sm font-medium text-text">
                  {CATEGORIES.find((c) => categoryHours[c.id] === Math.max(...Object.values(categoryHours)))?.label ?? '—'}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">بر اساس دسته‌بندی</CardTitle>
            </CardHeader>
            <div className="space-y-2 sm:space-y-3">
              {CATEGORIES.map((cat) => {
                const h = categoryHours[cat.id];
                const count = learningEntries.filter((e) => e.category === cat.id).length;
                return (
                  <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <cat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${cat.color}`} />
                      <span className="text-xs sm:text-sm text-text">{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted">
                      <span>{count} مورد</span><span>·</span><span>{h.toFixed(1)}h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
