import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const votes = await prisma.identityVote.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json({ votes });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const today = new Date().toISOString().split('T')[0];
  const vote = await prisma.identityVote.create({
    data: {
      date: today,
      action: body.action,
      category: body.category,
    },
  });
  return NextResponse.json({ vote }, { status: 201 });
}
