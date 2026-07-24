import 'dotenv/config';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const statements = [
  `
  CREATE TABLE IF NOT EXISTS Task (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    priority TEXT NOT NULL DEFAULT 'medium',
    estimatedMinutes INTEGER NOT NULL DEFAULT 30,
    category TEXT,
    date TEXT NOT NULL,
    goalId TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,

  `
  CREATE INDEX IF NOT EXISTS Task_date_idx ON Task(date)
  `,

  `
  CREATE INDEX IF NOT EXISTS Task_goalId_idx ON Task(goalId)
  `,

  `
  CREATE TABLE IF NOT EXISTS Goal (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    timeframe TEXT NOT NULL DEFAULT '1year',
    progress INTEGER NOT NULL DEFAULT 0,
    deadline TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,

  `
  CREATE INDEX IF NOT EXISTS Goal_timeframe_idx ON Goal(timeframe)
  `,

  `
  CREATE TABLE IF NOT EXISTS LearningEntry (
    id TEXT PRIMARY KEY NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    hours REAL NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,

  `
  CREATE INDEX IF NOT EXISTS LearningEntry_date_idx ON LearningEntry(date)
  `,

  `
  CREATE INDEX IF NOT EXISTS LearningEntry_category_idx ON LearningEntry(category)
  `,

  `
  CREATE TABLE IF NOT EXISTS JournalEntry (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    mood TEXT NOT NULL,
    energy TEXT NOT NULL,
    notes TEXT NOT NULL,
    lessons TEXT NOT NULL,
    gratitude TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,

  `
  CREATE INDEX IF NOT EXISTS JournalEntry_date_idx ON JournalEntry(date)
  `,

  `
  CREATE TABLE IF NOT EXISTS DailyStat (
    date TEXT PRIMARY KEY NOT NULL,
    tasksCompleted INTEGER NOT NULL DEFAULT 0,
    totalTasks INTEGER NOT NULL DEFAULT 0,
    studyHours REAL NOT NULL DEFAULT 0,
    gymSession BOOLEAN NOT NULL DEFAULT false,
    journalWritten BOOLEAN NOT NULL DEFAULT false,
    mood TEXT,
    score INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,

  `
  CREATE TABLE IF NOT EXISTS IdentityVote (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    action TEXT NOT NULL,
    category TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,

  `
  CREATE INDEX IF NOT EXISTS IdentityVote_date_idx ON IdentityVote(date)
  `,

  `
  CREATE INDEX IF NOT EXISTS IdentityVote_category_idx ON IdentityVote(category)
  `,

  `
  CREATE TABLE IF NOT EXISTS Settings (
    id TEXT PRIMARY KEY NOT NULL DEFAULT 'singleton',
    theme TEXT NOT NULL DEFAULT 'dark',
    dailyReminder BOOLEAN NOT NULL DEFAULT true,
    reminderTime TEXT NOT NULL DEFAULT '06:00',
    identityValues TEXT NOT NULL DEFAULT '[]',
    gymDays TEXT NOT NULL DEFAULT '[]',
    gymPlan TEXT NOT NULL DEFAULT '[]',
    password TEXT,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,
];

async function main() {
  for (const statement of statements) {
    await client.execute(statement);
  }

  console.log('Turso database initialized successfully!');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});