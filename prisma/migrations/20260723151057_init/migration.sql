-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 30,
    "category" TEXT,
    "date" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL DEFAULT '1year',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "deadline" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LearningEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hours" REAL NOT NULL,
    "date" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "energy" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "lessons" TEXT NOT NULL,
    "gratitude" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DailyStat" (
    "date" TEXT NOT NULL PRIMARY KEY,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalTasks" INTEGER NOT NULL DEFAULT 0,
    "studyHours" REAL NOT NULL DEFAULT 0,
    "gymSession" BOOLEAN NOT NULL DEFAULT false,
    "journalWritten" BOOLEAN NOT NULL DEFAULT false,
    "mood" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "IdentityVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "dailyReminder" BOOLEAN NOT NULL DEFAULT true,
    "reminderTime" TEXT NOT NULL DEFAULT '06:00',
    "identityValues" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Task_date_idx" ON "Task"("date");

-- CreateIndex
CREATE INDEX "Goal_timeframe_idx" ON "Goal"("timeframe");

-- CreateIndex
CREATE INDEX "LearningEntry_date_idx" ON "LearningEntry"("date");

-- CreateIndex
CREATE INDEX "LearningEntry_category_idx" ON "LearningEntry"("category");

-- CreateIndex
CREATE INDEX "JournalEntry_date_idx" ON "JournalEntry"("date");

-- CreateIndex
CREATE INDEX "DailyStat_date_idx" ON "DailyStat"("date");

-- CreateIndex
CREATE INDEX "IdentityVote_date_idx" ON "IdentityVote"("date");

-- CreateIndex
CREATE INDEX "IdentityVote_category_idx" ON "IdentityVote"("category");
