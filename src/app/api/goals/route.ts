import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const goals = await prisma.goal.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ goals });
}

export async function POST(req: NextRequest) {
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
}
