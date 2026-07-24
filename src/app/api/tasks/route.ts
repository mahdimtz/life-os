import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  const where = date ? { date } : {};
  const tasks = await prisma.task.findMany({ where, orderBy: [{ date: 'desc' }, { createdAt: 'desc' }] });
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const today = new Date().toISOString().split('T')[0];
  const task = await prisma.task.create({
    data: {
      title: body.title,
      priority: body.priority || 'medium',
      estimatedMinutes: body.estimatedMinutes || 30,
      category: body.category || null,
      date: body.date || today,
      goalId: body.goalId || null,
    },
  });
  return NextResponse.json({ task }, { status: 201 });
}
