'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { showNotificationToast } from '@/components/NotificationToast';

export function NotificationScheduler() {
  const settings = useAppStore((s) => s.settings);
  const tasks = useAppStore((s) => s.tasks);
  const goals = useAppStore((s) => s.goals);
  const loaded = useAppStore((s) => s.loaded);
  const lastFiredDate = useRef<string>('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buildMessage = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const tomorrowTasks = tasks.filter((t) => t.date === tomorrowStr && !t.completed);

    const activeGoals = goals.filter((g) => {
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

    if (activeGoals.length > 0) {
      body += `\n\n${activeGoals.length} هدف فعال داری.`;
    }

    return body;
  }, [tasks, goals]);

  const fireNotification = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastFiredDate.current === today) return;
    lastFiredDate.current = today;

    const body = buildMessage();

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('LifeOS — برنامه فردا', {
          body,
          icon: '/icon-192.png',
          tag: 'lifeos-daily-reminder',
        });
      } catch {
        // Notification failed — fallback to toast only
      }
    }

    // In-app toast (always shows)
    showNotificationToast('LifeOS — برنامه فردا', body);
  }, [buildMessage]);

  useEffect(() => {
    if (!settings.dailyReminder || !loaded) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const check = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (currentTime === settings.reminderTime) {
        fireNotification();
      }
    };

    // Check immediately on mount (in case page opened at the reminder time)
    check();

    // Check every second to never miss the exact minute
    timerRef.current = setInterval(check, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [settings.dailyReminder, settings.reminderTime, loaded, fireNotification]);

  return null;
}

export function NotificationPermissionButton() {
  const dailyReminder = useAppStore((s) => s.settings.dailyReminder);

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      showNotificationToast('مرورگر پشتیبانی نمی‌کند', 'مرورگر شما اعلان‌ها را پشتیبانی نمی‌کند.');
      return;
    }

    if (Notification.permission === 'granted') {
      showNotificationToast('اعلان فعال است', 'قبلاً مجوز اعلان را داده‌اید.');
      return;
    }

    if (Notification.permission === 'denied') {
      showNotificationToast('اعلان مسدود شده', 'لطفاً اعلان‌ها را از تنظیمات مرورگر فعال کنید.');
      return;
    }

    const result = await Notification.requestPermission();
    if (result === 'granted') {
      showNotificationToast('موفق!', 'اکنون اعلان‌های روزانه فعال هستند.');
    } else {
      showNotificationToast('رد شد', 'بدون مجوز اعلان، فقط اعلان داخلی نمایش داده می‌شود.');
    }
  };

  if (!dailyReminder) return null;

  // Only show button if permission hasn't been granted yet
  if (!('Notification' in window) || Notification.permission === 'granted') return null;

  return (
    <button
      onClick={handleRequestPermission}
      className="text-xs text-accent hover:text-accent/80 underline underline-offset-2 cursor-pointer"
    >
      فعال‌سازی اعلان مرورگر
    </button>
  );
}
