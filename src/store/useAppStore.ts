import { create } from 'zustand';
import {
  tasksApi,
  goalsApi,
  learningApi,
  journalApi,
  settingsApi,
  statsApi,
  identityApi,
  gymApi,
} from '@/lib/api';
import type {
  Goal,
  Task,
  LearningEntry,
  JournalEntry,
  Settings,
  DailyStats,
  IdentityVote,
  Mood,
  Energy,
  Priority,
} from '@/types';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

interface AppState {
  settings: Settings;
  tasks: Task[];
  goals: Goal[];
  learningEntries: LearningEntry[];
  journalEntries: JournalEntry[];
  identityVotes: IdentityVote[];
  dailyStats: DailyStats[];
  loaded: boolean;

  loadData: () => Promise<void>;

  addTask: (title: string, priority: Priority, estimatedMinutes: number, category?: string, goalId?: string, date?: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  addGoal: (title: string, description: string, timeframe: Goal['timeframe'], deadline: string) => Promise<void>;
  updateGoalProgress: (id: string, progress: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  addLearningEntry: (category: LearningEntry['category'], title: string, hours: number, notes?: string) => Promise<void>;
  deleteLearningEntry: (id: string) => Promise<void>;

  addJournalEntry: (mood: Mood, energy: Energy, notes: string, lessons: string, gratitude: string) => Promise<void>;
  updateJournalEntry: (id: string, data: Partial<Pick<JournalEntry, 'mood' | 'energy' | 'notes' | 'lessons' | 'gratitude'>>) => Promise<void>;

  updateSettings: (data: Partial<Settings>) => Promise<void>;

  addIdentityVote: (action: string, category: string) => Promise<void>;

  toggleGymSession: (date?: string) => Promise<void>;

  getTodayTasks: () => Task[];
  getTomorrowTasks: () => Task[];
  getTodayScore: () => number;
  getStreak: () => number;
  getIdentityScore: () => number;
  getLearningHours: (category: string) => number;
  getTodayLearningHours: () => number;
  getWeeklyStats: () => DailyStats[];
  getGymDays: () => number[];
  getTodayGymPlan: () => string[];
  getMoodTrend: () => { date: string; mood: number; label: string }[];
}

export const useAppStore = create<AppState>()((set, get) => ({
  settings: { theme: 'dark', dailyReminder: true, reminderTime: '06:00', identityValues: [], gymDays: [], gymPlan: [] },
  tasks: [],
  goals: [],
  learningEntries: [],
  journalEntries: [],
  identityVotes: [],
  dailyStats: [],
  loaded: false,

  // ── Load all data from API ──
  loadData: async () => {
    try {
      const [tasksRes, goalsRes, learningRes, journalRes, settingsRes, statsRes, identityRes] =
        await Promise.all([
          tasksApi.list(),
          goalsApi.list(),
          learningApi.list(),
          journalApi.list(),
          settingsApi.get(),
          statsApi.list(),
          identityApi.list(),
        ]);

      set({
        tasks: tasksRes.tasks,
        goals: goalsRes.goals,
        learningEntries: learningRes.entries,
        journalEntries: journalRes.entries,
        settings: settingsRes.settings,
        dailyStats: statsRes.stats,
        identityVotes: identityRes.votes,
        loaded: true,
      });
    } catch(error) {
      set({ loaded: true });
    }
  },

  // ── Tasks ──
  addTask: async (title, priority, estimatedMinutes, category, goalId, date) => {
    const { task } = await tasksApi.create({ title, priority, estimatedMinutes, category, goalId, date });
    set((s) => ({ tasks: [...s.tasks, task] }));
  },

  toggleTask: async (id) => {
    const { task } = await tasksApi.toggle(id);
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: task.completed } : t)),
    }));
    // Refresh stats and goals (goal progress may have changed)
    const [statsRes, goalsRes] = await Promise.all([statsApi.list(), goalsApi.list()]);
    set({ dailyStats: statsRes.stats, goals: goalsRes.goals });
  },

  deleteTask: async (id) => {
    await tasksApi.remove(id);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },

  // ── Goals ──
  addGoal: async (title, description, timeframe, deadline) => {
    const { goal } = await goalsApi.create({ title, description, timeframe, deadline });
    set((s) => ({ goals: [...s.goals, goal] }));
  },

  updateGoalProgress: async (id, progress) => {
    const { goal } = await goalsApi.updateProgress(id, progress);
    set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, progress: goal.progress } : g)) }));
  },

  deleteGoal: async (id) => {
    await goalsApi.remove(id);
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
  },

  // ── Learning ──
  addLearningEntry: async (category, title, hours, notes) => {
    const { entry } = await learningApi.create({ category, title, hours, notes });
    set((s) => ({ learningEntries: [...s.learningEntries, entry] }));
  },

  deleteLearningEntry: async (id) => {
    await learningApi.remove(id);
    set((s) => ({ learningEntries: s.learningEntries.filter((e) => e.id !== id) }));
  },

  // ── Journal ──
  addJournalEntry: async (mood, energy, notes, lessons, gratitude) => {
    const { entry } = await journalApi.create({ mood, energy, notes, lessons, gratitude });
    set((s) => ({ journalEntries: [...s.journalEntries, entry] }));
  },

  updateJournalEntry: async (id, data) => {
    const { entry } = await journalApi.update(id, data);
    set((s) => ({
      journalEntries: s.journalEntries.map((e) => (e.id === id ? { ...e, ...entry } : e)),
    }));
  },

  // ── Settings ──
  updateSettings: async (data) => {
    const { settings } = await settingsApi.update(data);
    set({ settings });
  },

  // ── Identity ──
  addIdentityVote: async (action, category) => {
    const { vote } = await identityApi.create({ action, category });
    set((s) => ({ identityVotes: [...s.identityVotes, vote] }));
  },

  // ── Gym ──
  toggleGymSession: async (date) => {
    const { stat } = await gymApi.toggle(date);
    set((s) => ({
      dailyStats: s.dailyStats.map((d) => (d.date === stat.date ? { ...d, gymSession: stat.gymSession } : d)),
    }));
  },

  // ── Helpers (client-side computed) ──
  getTodayTasks: () => {
    const d = today();
    return get().tasks.filter((t) => t.date === d);
  },

  getTomorrowTasks: () => {
    const d = tomorrow();
    return get().tasks.filter((t) => t.date === d);
  },

  getTodayScore: () => {
    const todayTasks = get().getTodayTasks();
    if (todayTasks.length === 0) return 0;
    const done = todayTasks.filter((t) => t.completed).length;
    return Math.round((done / todayTasks.length) * 100);
  },

  getStreak: () => {
    const stats = get().dailyStats;
    if (stats.length === 0) return 0;
    let streak = 0;
    const sorted = [...stats].sort((a, b) => b.date.localeCompare(a.date));
    for (const s of sorted) {
      if (s.score >= 50) streak++;
      else break;
    }
    return streak;
  },

  getIdentityScore: () => {
    const votes = get().identityVotes;
    const last30 = votes.filter((v) => {
      const d = new Date(v.date);
      const now = new Date();
      return now.getTime() - d.getTime() < 30 * 24 * 60 * 60 * 1000;
    });
    return Math.min(100, last30.length * 5);
  },

  getLearningHours: (category) => {
    return get()
      .learningEntries.filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.hours, 0);
  },

  getTodayLearningHours: () => {
    const d = today();
    return get()
      .learningEntries.filter((e) => e.date === d)
      .reduce((sum, e) => sum + e.hours, 0);
  },

  getWeeklyStats: () => {
    const stats = get().dailyStats;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return stats.filter((s) => new Date(s.date) >= weekAgo).sort((a, b) => a.date.localeCompare(b.date));
  },

  getGymDays: () => {
    return get().settings.gymDays || [];
  },

  getTodayGymPlan: () => {
    const d = new Date();
    const dayOfWeek = d.getDay();
    const gymDays = get().getGymDays();
    if (gymDays.includes(dayOfWeek)) {
      return get().settings.gymPlan || [];
    }
    return [];
  },

  getMoodTrend: () => {
    const moodValues: Record<string, number> = { great: 5, good: 4, neutral: 3, bad: 2, terrible: 1 };
    const moodLabels: Record<string, string> = { great: 'عالی', good: 'خوب', neutral: 'معمولی', bad: 'بد', terrible: 'خیلی بد' };
    return [...get().journalEntries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)
      .map((e) => ({
        date: new Date(e.date).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
        mood: moodValues[e.mood] ?? 3,
        label: moodLabels[e.mood] ?? 'نامشخص',
      }));
  },
}));
