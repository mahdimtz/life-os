-- AlterTable
ALTER TABLE "Task" ADD COLUMN "goalId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "dailyReminder" BOOLEAN NOT NULL DEFAULT true,
    "reminderTime" TEXT NOT NULL DEFAULT '06:00',
    "identityValues" TEXT NOT NULL DEFAULT '[]',
    "gymDays" TEXT NOT NULL DEFAULT '[]',
    "gymPlan" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("dailyReminder", "id", "identityValues", "reminderTime", "theme", "updatedAt") SELECT "dailyReminder", "id", "identityValues", "reminderTime", "theme", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Task_goalId_idx" ON "Task"("goalId");
