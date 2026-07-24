import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function safeJsonParse(val: string | undefined | null, fallback: any) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}

export async function GET() {
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
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const data: Record<string, any> = {};
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
      identityValues: data.identityValues || JSON.stringify(['انضباط', 'پشتکار', 'شجاعت', 'رشد', 'تمرکز']),
      gymDays: data.gymDays || '[]',
      gymPlan: data.gymPlan || '[]',
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
}
