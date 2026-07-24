'use client';

import { useState } from 'react';
import { BookOpen, ChevronLeft, Lightbulb, Heart, Sparkles, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Mood, Energy, JournalEntry } from '@/types';

const MOODS: { value: Mood; label: string; emoji: string; color: string; badge: 'success' | 'info' | 'default' | 'warning' | 'danger' }[] = [
  { value: 'great', label: 'عالی', emoji: '🤩', color: 'bg-success/20 border-success text-success', badge: 'success' },
  { value: 'good', label: 'خوب', emoji: '😊', color: 'bg-info/20 border-info text-info', badge: 'info' },
  { value: 'neutral', label: 'معمولی', emoji: '😐', color: 'bg-muted/20 border-muted text-muted', badge: 'default' },
  { value: 'bad', label: 'بد', emoji: '😔', color: 'bg-warning/20 border-warning text-warning', badge: 'warning' },
  { value: 'terrible', label: 'خیلی بد', emoji: '😣', color: 'bg-danger/20 border-danger text-danger', badge: 'danger' },
];

const ENERGY_OPTIONS: { value: Energy; label: string; icon: string }[] = [
  { value: 'high', label: 'زیاد', icon: '⚡' },
  { value: 'medium', label: 'متوسط', icon: '🔋' },
  { value: 'low', label: 'کم', icon: '🪫' },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = today.getTime() - target.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'امروز';
  if (days === 1) return 'دیروز';
  return date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getMoodInfo(mood: Mood) {
  return MOODS.find((m) => m.value === mood)!;
}

export default function JournalPage() {
  const journalEntries = useAppStore((s) => s.journalEntries);
  const addJournalEntry = useAppStore((s) => s.addJournalEntry);
  const updateJournalEntry = useAppStore((s) => s.updateJournalEntry);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<Energy | null>(null);
  const [notes, setNotes] = useState('');
  const [lessons, setLessons] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const sortedEntries = [...journalEntries].sort((a, b) => b.date.localeCompare(a.date));
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = journalEntries.find((e) => e.date === todayStr);

  function handleSave() {
    if (!selectedMood || !selectedEnergy) return;
    if (isEditing && selectedEntry) {
      updateJournalEntry(selectedEntry.id, { mood: selectedMood, energy: selectedEnergy, notes, lessons, gratitude });
      setIsEditing(false); setSelectedEntry(null);
    } else {
      addJournalEntry(selectedMood, selectedEnergy, notes, lessons, gratitude);
    }
    resetForm();
  }

  function resetForm() { setSelectedMood(null); setSelectedEnergy(null); setNotes(''); setLessons(''); setGratitude(''); }

  function handleEdit(entry: JournalEntry) {
    setSelectedEntry(entry); setSelectedMood(entry.mood); setSelectedEnergy(entry.energy);
    setNotes(entry.notes); setLessons(entry.lessons); setGratitude(entry.gratitude); setIsEditing(true);
  }

  function handleCancel() { resetForm(); setSelectedEntry(null); setIsEditing(false); }

  function handleEntryClick(entry: JournalEntry) {
    if (todayEntry?.id === entry.id) handleEdit(entry);
    else setSelectedEntry(entry);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text mb-1">ژورنال</h1>
        <p className="text-xs sm:text-sm text-muted">فکر کن، یاد بگیر، رشد کن — یه ورودی در یک زمان.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">{isEditing ? 'ویرایش ورودی' : 'ورودی امروز'}</CardTitle>
          {isEditing && <Button variant="ghost" size="sm" onClick={handleCancel}><X size={14} /> انصراف</Button>}
        </CardHeader>
        <div className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-text-secondary mb-2 sm:mb-3 uppercase tracking-wider">احساس</label>
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1">
              {MOODS.map((mood) => (
                <button key={mood.value} onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border transition-all duration-200 cursor-pointer flex-shrink-0
                    ${selectedMood === mood.value ? `${mood.color} border-2 scale-105` : 'bg-surface-hover border-border hover:bg-muted/10'}`}>
                  <span className="text-xl sm:text-2xl">{mood.emoji}</span>
                  <span className="text-[10px] sm:text-xs font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-text-secondary mb-2 sm:mb-3 uppercase tracking-wider">سطح انرژی</label>
            <div className="flex gap-1.5 sm:gap-2">
              {ENERGY_OPTIONS.map((energy) => (
                <button key={energy.value} onClick={() => setSelectedEnergy(energy.value)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer
                    ${selectedEnergy === energy.value ? 'bg-accent/20 border-accent text-accent border-2' : 'bg-surface-hover border-border text-text-secondary hover:bg-muted/10'}`}>
                  <span className="text-base sm:text-lg">{energy.icon}</span> {energy.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">یادداشت</label>
            <Textarea placeholder="امروز چه اتفاقی افتاد؟" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
              <Lightbulb size={12} /> درس‌های آموخته
            </label>
            <Textarea placeholder="امروز چه چیزی یاد گرفتی؟" value={lessons} onChange={(e) => setLessons(e.target.value)} rows={2} />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
              <Heart size={12} /> قدردانی
            </label>
            <Textarea placeholder="از چه چیزی ممنونی؟" value={gratitude} onChange={(e) => setGratitude(e.target.value)} rows={2} />
          </div>

          <Button onClick={handleSave} disabled={!selectedMood || !selectedEnergy} className="w-full">
            <Sparkles size={16} /> {isEditing ? 'بروزرسانی' : 'ذخیره'}
          </Button>
        </div>
      </Card>

      {selectedEntry && !isEditing && (
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">ورودی — {formatDate(selectedEntry.date)}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSelectedEntry(null)}><X size={14} /></Button>
          </CardHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{getMoodInfo(selectedEntry.mood).emoji}</span>
                <Badge variant={getMoodInfo(selectedEntry.mood).badge}>{selectedEntry.mood}</Badge>
              </div>
              <Badge variant="info">{ENERGY_OPTIONS.find((e) => e.value === selectedEntry.energy)?.icon} {selectedEntry.energy}</Badge>
            </div>
            {selectedEntry.notes && <div><h4 className="text-[10px] sm:text-xs font-medium text-muted uppercase tracking-wider mb-1">یادداشت</h4><p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{selectedEntry.notes}</p></div>}
            {selectedEntry.lessons && <div><h4 className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted uppercase tracking-wider mb-1"><Lightbulb size={12} /> درس‌ها</h4><p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{selectedEntry.lessons}</p></div>}
            {selectedEntry.gratitude && <div><h4 className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted uppercase tracking-wider mb-1"><Heart size={12} /> قدردانی</h4><p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{selectedEntry.gratitude}</p></div>}
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 sm:mb-4">ورودی‌های قبلی</h2>
        {sortedEntries.length === 0 ? (
          <EmptyState icon={BookOpen} title="هنوز ژورنالی نیست" description="از بالا شروع کن و اولین ورودیت رو بنویس." />
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {sortedEntries.map((entry) => {
              const moodInfo = getMoodInfo(entry.mood);
              return (
                <button key={entry.id} onClick={() => handleEntryClick(entry)} className="w-full text-left">
                  <Card className="hover:border-accent/30 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-xl sm:text-2xl">{moodInfo.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                          <span className="text-xs sm:text-sm font-medium text-text">{formatDate(entry.date)}</span>
                          <Badge variant={moodInfo.badge} className="text-[9px] sm:text-[10px]">{entry.mood}</Badge>
                          <Badge variant="info" className="text-[9px] sm:text-[10px]">{ENERGY_OPTIONS.find((e) => e.value === entry.energy)?.icon} {entry.energy}</Badge>
                        </div>
                        {entry.notes && <p className="text-[10px] sm:text-xs text-muted truncate">{entry.notes}</p>}
                      </div>
                      <ChevronLeft size={14} className="text-muted group-hover:text-accent transition-colors rotate-180" />
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
