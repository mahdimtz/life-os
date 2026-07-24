import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const goal = await prisma.goal.update({
      where: { id },
      data: { progress: body.progress },
    });
    return NextResponse.json({ goal });
  } catch (error) {
    console.error('[PATCH /api/goals/[id]]', error);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.goal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/goals/[id]]', error);
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}
