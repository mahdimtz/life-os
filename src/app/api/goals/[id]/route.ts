import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const goal = await prisma.goal.update({
    where: { id },
    data: { progress: body.progress },
  });
  return NextResponse.json({ goal });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.goal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
