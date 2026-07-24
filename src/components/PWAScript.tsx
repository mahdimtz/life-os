'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function NotificationScheduler() {
  const settings = useAppStore((s) => s.settings);
  const tasks = useAppStore((s) => s.tasks);
  const goals = useAppStore((s) => s.goals);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!settings.dailyReminder) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Request notification permission on enable
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const check = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (currentTime === settings.reminderTime) {
        // Get tomorrow's tasks
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const tomorrowTasks = tasks.filter((t) => t.date === tomorrowStr && !t.completed);

        // Get today's goals
        const todayGoals = goals.filter((g) => {
          const deadline = new Date(g.deadline);
          return deadline >= new Date() && g.progress < 100;
        });

        let body = '';
        if (tomorrowTasks.length > 0) {
          body += `${tomorrowTasks.length} وظیفه برای فردا داری.\n`;
          tomorrowTasks.slice(0, 3).forEach((t) => {
            body += `• ${t.title}\n`;
          });
          if (tomorrowTasks.length > 3) {
            body += `و ${tomorrowTasks.length - 3} وظیفه دیگر...`;
          }
        } else {
          body = 'فردا هنوز برنامه‌ای نداری. وقت برنامه‌ریزیه!';
        }

        if (todayGoals.length > 0) {
          body += `\n\n${todayGoals.length} هدف فعال داری.`;
        }

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('LifeOS — برنامه فردا', {
            body,
            icon: '/icon-192.png',
          });
        }
      }
    };

    timerRef.current = setInterval(check, 30000); // check every 30s
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [settings.dailyReminder, settings.reminderTime, tasks, goals]);

  return null;
}
