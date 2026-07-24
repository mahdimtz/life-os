import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const votes = await prisma.identityVote.findMany({ orderBy: { date: 'desc' } });
    return NextResponse.json({ votes });
  } catch (error) {
    console.error('[GET /api/identity]', error);
    return NextResponse.json({ error: 'Failed to fetch identity votes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
  } catch (error) {
    console.error('[POST /api/identity]', error);
    return NextResponse.json({ error: 'Failed to create identity vote' }, { status: 500 });
  }
}
