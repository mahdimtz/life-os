import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE() {
  try {
    await prisma.$transaction([
      prisma.task.deleteMany(),
      prisma.goal.deleteMany(),
      prisma.learningEntry.deleteMany(),
      prisma.journalEntry.deleteMany(),
      prisma.dailyStat.deleteMany(),
      prisma.identityVote.deleteMany(),
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/data/reset]', error);
    return NextResponse.json({ error: 'Failed to reset data' }, { status: 500 });
  }
}
