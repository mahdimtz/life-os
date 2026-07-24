import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });

    const today = new Date().toISOString().split('T')[0];
    const todayTasks = await prisma.task.findMany({ where: { date: today } });
    const completed = todayTasks.filter((t) => t.completed).length;
    const total = todayTasks.length;
    const score = total > 0 ? Math.round((completed / total) * 100) : 0;

    await prisma.dailyStat.upsert({
      where: { date: today },
      update: { tasksCompleted: completed, totalTasks: total, score },
      create: { date: today, tasksCompleted: completed, totalTasks: total, score },
    });

    if (updated.goalId) {
      const goalTasks = await prisma.task.findMany({ where: { goalId: updated.goalId } });
      const goalCompleted = goalTasks.filter((t) => t.completed).length;
      const goalTotal = goalTasks.length;
      const goalProgress = goalTotal > 0 ? Math.round((goalCompleted / goalTotal) * 100) : 0;

      await prisma.goal.update({
        where: { id: updated.goalId },
        data: { progress: goalProgress },
      });
    }

    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error('[PATCH /api/tasks/[id]/toggle]', error);
    return NextResponse.json({ error: 'Failed to toggle task' }, { status: 500 });
  }
}
