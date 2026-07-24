import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const entry = await prisma.journalEntry.update({
      where: { id },
      data: body,
    });
    return NextResponse.json({ entry });
  } catch (error) {
    console.error('[PATCH /api/journal/[id]]', error);
    return NextResponse.json({ error: 'Failed to update journal entry' }, { status: 500 });
  }
}
