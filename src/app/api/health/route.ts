import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = process.env.TURSO_DATABASE_URL;
    const hasToken = !!process.env.TURSO_AUTH_TOKEN;

    const taskCount = await prisma.task.count();
    const goalCount = await prisma.goal.count();
    const learningCount = await prisma.learningEntry.count();
    const journalCount = await prisma.journalEntry.count();

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      hasUrl: !!url,
      hasAuthToken: hasToken,
      counts: {
        tasks: taskCount,
        goals: goalCount,
        learning: learningCount,
        journal: journalCount,
      },
    });
  } catch (error) {
    console.error('[GET /api/health]', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
