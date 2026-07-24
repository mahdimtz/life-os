import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const entries = await prisma.journalEntry.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const today = new Date().toISOString().split('T')[0];
  const entry = await prisma.journalEntry.create({
    data: {
      date: today,
      mood: body.mood,
      energy: body.energy,
      notes: body.notes,
      lessons: body.lessons,
      gratitude: body.gratitude,
    },
  });

  // Update DailyStat for mood and journalWritten
  await prisma.dailyStat.upsert({
    where: { date: today },
    update: { mood: body.mood, journalWritten: true },
    create: { date: today, mood: body.mood, journalWritten: true },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
