import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const entries = await prisma.learningEntry.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const today = new Date().toISOString().split('T')[0];
  const entryDate = body.date || today;

  const entry = await prisma.learningEntry.create({
    data: {
      category: body.category,
      title: body.title,
      hours: body.hours,
      date: entryDate,
      notes: body.notes || null,
    },
  });

  // Update DailyStat.studyHours for this date
  const dayEntries = await prisma.learningEntry.findMany({ where: { date: entryDate } });
  const totalHours = dayEntries.reduce((sum, e) => sum + e.hours, 0);

  await prisma.dailyStat.upsert({
    where: { date: entryDate },
    update: { studyHours: totalHours },
    create: { date: entryDate, studyHours: totalHours },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
