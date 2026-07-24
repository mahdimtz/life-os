import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const stats = await prisma.dailyStat.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json({ stats });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const stat = await prisma.dailyStat.upsert({
    where: { date: body.date },
    update: body,
    create: body,
  });
  return NextResponse.json({ stat });
}
