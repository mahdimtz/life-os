import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
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
  } catch (error) {
    console.error('[POST /api/gym/toggle]', error);
    return NextResponse.json({ error: 'Failed to toggle gym session' }, { status: 500 });
  }
}
