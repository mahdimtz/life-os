import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const today = new Date().toISOString().split('T')[0];
  const date = body.date || today;

  const existing = await prisma.dailyStat.findUnique({ where: { date } });
  const newGymSession = existing ? !existing.gymSession : true;

  const stat = await prisma.dailyStat.upsert({
    where: { date },
    update: { gymSession: newGymSession },
    create: { date, gymSession: true },
  });

  return NextResponse.json({ stat });
}
