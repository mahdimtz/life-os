import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await prisma.dailyStat.findMany({ orderBy: { date: 'desc' } });
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('[GET /api/stats]', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const stat = await prisma.dailyStat.upsert({
      where: { date: body.date },
      update: body,
      create: body,
    });
    return NextResponse.json({ stat });
  } catch (error) {
    console.error('[POST /api/stats]', error);
    return NextResponse.json({ error: 'Failed to upsert stat' }, { status: 500 });
  }
}
