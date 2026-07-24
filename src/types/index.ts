// ─── Goals ────────────────────────────────────────────
export interface Goal {
  id: string;
  title: string;
  description: string;
  timeframe: '1year' | '3years' | '5years';
  progress: number;
  deadline: string;
  createdAt: string;
}

// ─── Tasks / Missions ────────────────────────────────
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  estimatedMinutes: number;
  category?: string;
  date: string;
  goalId?: string;
}

// ─── Learning ─────────────────────────────────────────
export interface LearningEntry {
  id: string;
  category: 'backend' | 'frontend' | 'english' | 'books';
  title: string;
  hours: number;
  date: string;
  notes?: string;
}

// ─── Journal ──────────────────────────────────────────
export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
export type Energy = 'high' | 'medium' | 'low';

export interface JournalEntry {
  id: string;
  date: string;
  mood: Mood;
  energy: Energy;
  notes: string;
  lessons: string;
  gratitude: string;
}

// ─── Operations ───────────────────────────────────────
export type OperationType =
  | 'fatigue'
  | 'urge'
  | 'sadness'
  | 'anxiety'
  | 'failure'
  | 'restart';

export interface Operation {
  id: string;
  type: OperationType;
  title: string;
  explanation: string;
  immediateAction: string;
  emergencyPlan: string[];
  recoverySteps: string[];
  example: string;
}

// ─── Settings ─────────────────────────────────────────
export interface Settings {
  theme: 'dark' | 'light' | 'system';
  dailyReminder: boolean;
  reminderTime: string;
  identityValues: string[];
  gymDays: number[];
  gymPlan: string[];
}

// ─── Stats ────────────────────────────────────────────
export interface DailyStats {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  studyHours: number;
  gymSession: boolean;
  journalWritten: boolean;
  mood?: Mood;
  score: number;
}

// ─── Identity ─────────────────────────────────────────
export interface IdentityVote {
  id: string;
  date: string;
  action: string;
  category: string;
}
