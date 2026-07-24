import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [tasks, goals, learningEntries, journalEntries, dailyStats, identityVotes, settings] =
    await Promise.all([
      prisma.task.findMany(),
      prisma.goal.findMany(),
      prisma.learningEntry.findMany(),
      prisma.journalEntry.findMany(),
      prisma.dailyStat.findMany(),
      prisma.identityVote.findMany(),
      prisma.settings.findUnique({ where: { id: 'singleton' } }),
    ]);

  return NextResponse.json({
    tasks,
    goals,
    learningEntries,
    journalEntries,
    dailyStats,
    identityVotes,
    settings: settings
      ? {
          ...settings,
          identityValues: JSON.parse(settings.identityValues),
          gymDays: JSON.parse(settings.gymDays || '[]'),
          gymPlan: JSON.parse(settings.gymPlan || '[]'),
        }
      : null,
    exportedAt: new Date().toISOString(),
  });
}
