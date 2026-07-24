import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const entries = await prisma.journalEntry.findMany({ orderBy: { date: 'desc' } });
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('[GET /api/journal]', error);
    return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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

    await prisma.dailyStat.upsert({
      where: { date: today },
      update: { mood: body.mood, journalWritten: true },
      create: { date: today, mood: body.mood, journalWritten: true },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/journal]', error);
    return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 });
  }
}
