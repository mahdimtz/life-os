import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function safeJsonParse(val: string | undefined | null, fallback: unknown) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 'singleton',
          identityValues: JSON.stringify(['انضباط', 'پشتکار', 'شجاعت', 'رشد', 'تمرکز']),
          gymDays: '[]',
          gymPlan: '[]',
        },
      });
    }
    return NextResponse.json({
      settings: {
        ...settings,
        identityValues: safeJsonParse(settings.identityValues, ['انضباط', 'پشتکار', 'شجاعت', 'رشد', 'تمرکز']),
        gymDays: safeJsonParse(settings.gymDays, []),
        gymPlan: safeJsonParse(settings.gymPlan, []),
      },
    });
  } catch (error) {
    console.error('[GET /api/settings]', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.theme !== undefined) data.theme = body.theme;
    if (body.dailyReminder !== undefined) data.dailyReminder = body.dailyReminder;
    if (body.reminderTime !== undefined) data.reminderTime = body.reminderTime;
    if (body.identityValues !== undefined) data.identityValues = JSON.stringify(body.identityValues);
    if (body.gymDays !== undefined) data.gymDays = JSON.stringify(body.gymDays);
    if (body.gymPlan !== undefined) data.gymPlan = JSON.stringify(body.gymPlan);

    const settings = await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: {
        id: 'singleton',
        ...data,
        identityValues: data.identityValues as string || JSON.stringify(['انضباط', 'پشتکار', 'شجاعت', 'رشد', 'تمرکز']),
        gymDays: data.gymDays as string || '[]',
        gymPlan: data.gymPlan as string || '[]',
      },
    });

    return NextResponse.json({
      settings: {
        ...settings,
        identityValues: safeJsonParse(settings.identityValues, []),
        gymDays: safeJsonParse(settings.gymDays, []),
        gymPlan: safeJsonParse(settings.gymPlan, []),
      },
    });
  } catch (error) {
    console.error('[PATCH /api/settings]', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
