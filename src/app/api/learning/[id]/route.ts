import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.learningEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/learning/[id]]', error);
    return NextResponse.json({ error: 'Failed to delete learning entry' }, { status: 500 });
  }
}
