import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
  await prisma.$transaction([
    prisma.task.deleteMany(),
    prisma.goal.deleteMany(),
    prisma.learningEntry.deleteMany(),
    prisma.journalEntry.deleteMany(),
    prisma.dailyStat.deleteMany(),
    prisma.identityVote.deleteMany(),
  ]);
  return NextResponse.json({ success: true });
}
