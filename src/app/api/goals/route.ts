import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const goals = await prisma.goal.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ goals });
  } catch (error) {
    console.error('[GET /api/goals]', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const goal = await prisma.goal.create({
      data: {
        title: body.title,
        description: body.description,
        timeframe: body.timeframe || '1year',
        deadline: body.deadline,
      },
    });
    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/goals]', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
