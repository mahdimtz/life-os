import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export async function POST() {
  const existing = await prisma.task.count();
  if (existing > 0) {
    return NextResponse.json({ success: true, message: 'Data already exists' });
  }

  const t = today();

  // Seed tasks
  await prisma.task.createMany({
    data: [
      { title: 'تمرین صبحگاهی — سینه و سه\u200cسر', completed: true, priority: 'high', estimatedMinutes: 60, category: 'gym', date: t },
      { title: 'ASP.NET Core — یادگیری Middleware', completed: true, priority: 'high', estimatedMinutes: 90, category: 'backend', date: t },
      { title: 'انگلیسی — ۳۰ دقیقه واژه\u200cآموزی', completed: false, priority: 'medium', estimatedMinutes: 30, category: 'english', date: t },
      { title: 'بررسی کد پروژه GitHub', completed: false, priority: 'medium', estimatedMinutes: 45, date: t },
      { title: 'خواندن ۲۰ صفحه کتاب', completed: true, priority: 'low', estimatedMinutes: 20, category: 'books', date: t },
      { title: 'نوشتن یادداشت روزانه', completed: false, priority: 'low', estimatedMinutes: 15, date: t },
    ],
  });

  // Seed goals
  await prisma.goal.createMany({
    data: [
      { title: 'توسعه\u200cدهنده سطح متوسط .NET شدن', description: 'تسلط بر ASP.NET Core، EF Core و ساخت ۳ پروژه نمونه\u200cکار', timeframe: '1year', progress: 35, deadline: '2027-06-30' },
      { title: 'رسیدن به سطح B2 انگلیسی', description: 'قبولی در آزمون IELTS با نمره ۶.۵ به بالا', timeframe: '1year', progress: 20, deadline: '2027-06-30' },
      { title: 'استخدام از راه دور', description: 'پیدا کردن شغل تمام\u200cوقت تمام\u200cremote در یک شرکت بین\u200cالمللی', timeframe: '3years', progress: 10, deadline: '2029-06-30' },
      { title: 'استقلال مالی', description: 'داشتن ۶ ماه صندوق اضطراری + درآمد جانبی', timeframe: '5years', progress: 5, deadline: '2031-06-30' },
      { title: 'حفظ اندام ورزشی ۸۰ کیلو', description: 'باشگاه ۳ بار در هفته، تغذیه سالم', timeframe: '1year', progress: 45, deadline: '2027-06-30' },
      { title: 'یادگیری React و Next.js', description: 'تسلط بر React، Next.js و TailwindCSS', timeframe: '1year', progress: 55, deadline: '2027-03-30' },
    ],
  });

  // Seed learning entries
  await prisma.learningEntry.createMany({
    data: [
      { category: 'backend', title: 'Middleware Pipeline در ASP.NET Core', hours: 2.5, date: daysAgo(0), notes: 'درک نحوه کار Request Pipeline' },
      { category: 'backend', title: 'Dependency Injection', hours: 3, date: daysAgo(1), notes: 'تزریق وابستگی در .NET Core' },
      { category: 'backend', title: 'Entity Framework Core Basics', hours: 2, date: daysAgo(3), notes: 'CRUD Operations و Migration' },
      { category: 'frontend', title: 'React Hooks پیشرفته', hours: 2, date: daysAgo(2), notes: 'useCallback, useMemo, useRef' },
      { category: 'frontend', title: 'TailwindCSS Grid Layout', hours: 1.5, date: daysAgo(4), notes: 'سیستم گرید و ریسپانسیو' },
      { category: 'english', title: 'واژه\u200cهای تکنیکال برنامه\u200cنویسی', hours: 1, date: daysAgo(0) },
      { category: 'english', title: 'گرامر زمان\u200cهای انگلیسی', hours: 1.5, date: daysAgo(2) },
      { category: 'books', title: 'Atomic Habits — فصل ۴ و ۵', hours: 1, date: daysAgo(1), notes: 'سیستم\u200cهای ۱٪ بهتر شدن' },
      { category: 'books', title: 'Clean Code — فصل ۲', hours: 0.5, date: daysAgo(5) },
      { category: 'backend', title: 'Authentication در Web API', hours: 2.5, date: daysAgo(5), notes: 'JWT Token و OAuth' },
      { category: 'frontend', title: 'Zustand State Management', hours: 1.5, date: daysAgo(6) },
      { category: 'english', title: 'IELTS Reading Practice', hours: 2, date: daysAgo(3) },
    ],
  });

  // Seed journal entries
  await prisma.journalEntry.createMany({
    data: [
      { date: daysAgo(0), mood: 'good', energy: 'high', notes: 'امروز روز خوبی بود. صبح زود بیدار شدم و تمرینم رو انجام دادم.', lessons: 'وقتی صبح زود بیدار میشی، کل روز بهتر پیش میره.', gratitude: 'ممنونم از سلامتیم و اینکه وقت یادگیری دارم.' },
      { date: daysAgo(1), mood: 'great', energy: 'high', notes: 'امروز یه مفهوم سخت رو فهمیدم. حس پیشرفت عالی بود.', lessons: 'وقتی چیزی رو نمیفهمی، ۱۵ دقیقه استراحت کن و برگرد.', gratitude: 'ممنونم از پروژه\u200cام که دارم روش کار می\u200cکنم.' },
      { date: daysAgo(2), mood: 'neutral', energy: 'medium', notes: 'روز معمولی بود. کارهام رو انجام دادم ولی انرژی خاصی نداشتم.', lessons: 'نباید انتظار داشته باشی هر روز عالی باشه.', gratitude: 'ممنونم از غذای خوبی که خوردم.' },
      { date: daysAgo(3), mood: 'bad', energy: 'low', notes: 'خسته بودم و نتونستم تمرکز کنم. ولی بازم یکم کار کردم.', lessons: 'روزای سخت هم بخشی از مسیره. مهم اینه که متوقف نشی.', gratitude: 'ممنونم از دوستم که بهم انگیزه داد.' },
      { date: daysAgo(4), mood: 'good', energy: 'medium', notes: 'بعد از روز سخت دیروز، امروز بهتر بود.', lessons: 'یه قدم کوچیک بهتر از هیچیه.', gratitude: 'ممنونم از باشگاه که انرژیم رو برگردوند.' },
      { date: daysAgo(5), mood: 'great', energy: 'high', notes: 'عالی! امروز همه کارهام رو انجام دادم و حتی بیشتر.', lessons: 'وقتی انرژی داری، بیشتر کار کن تا روزای سخت رو جبران کنی.', gratitude: 'ممنونم از خانواده\u200cام.' },
    ],
  });

  // Seed daily stats
  await prisma.dailyStat.createMany({
    data: [
      { date: daysAgo(6), tasksCompleted: 3, totalTasks: 5, studyHours: 2, gymSession: false, journalWritten: true, mood: 'good', score: 60 },
      { date: daysAgo(5), tasksCompleted: 5, totalTasks: 5, studyHours: 4, gymSession: true, journalWritten: true, mood: 'great', score: 100 },
      { date: daysAgo(4), tasksCompleted: 4, totalTasks: 6, studyHours: 3, gymSession: true, journalWritten: true, mood: 'good', score: 67 },
      { date: daysAgo(3), tasksCompleted: 2, totalTasks: 5, studyHours: 1, gymSession: false, journalWritten: true, mood: 'bad', score: 40 },
      { date: daysAgo(2), tasksCompleted: 4, totalTasks: 5, studyHours: 2.5, gymSession: true, journalWritten: true, mood: 'neutral', score: 80 },
      { date: daysAgo(1), tasksCompleted: 5, totalTasks: 5, studyHours: 3.5, gymSession: false, journalWritten: true, mood: 'great', score: 100 },
      { date: daysAgo(0), tasksCompleted: 3, totalTasks: 6, studyHours: 2.5, gymSession: true, journalWritten: true, mood: 'good', score: 50 },
    ],
  });

  // Seed identity votes
  await prisma.identityVote.createMany({
    data: [
      { date: daysAgo(0), action: 'عمل با انضباط', category: 'انضباط' },
      { date: daysAgo(0), action: 'عمل با پشتکار', category: 'پشتکار' },
      { date: daysAgo(1), action: 'عمل با شجاعت', category: 'شجاعت' },
      { date: daysAgo(1), action: 'عمل با تمرکز', category: 'تمرکز' },
      { date: daysAgo(2), action: 'عمل با رشد', category: 'رشد' },
      { date: daysAgo(3), action: 'عمل با انضباط', category: 'انضباط' },
      { date: daysAgo(4), action: 'عمل با پشتکار', category: 'پشتکار' },
      { date: daysAgo(5), action: 'عمل با شجاعت', category: 'شجاعت' },
      { date: daysAgo(5), action: 'عمل با تمرکز', category: 'تمرکز' },
      { date: daysAgo(6), action: 'عمل با رشد', category: 'رشد' },
      { date: daysAgo(7), action: 'عمل با انضباط', category: 'انضباط' },
      { date: daysAgo(8), action: 'عمل با پشتکار', category: 'پشتکار' },
    ],
  });

  // Seed settings
  await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      identityValues: JSON.stringify(['انضباط', 'پشتکار', 'شجاعت', 'رشد', 'تمرکز']),
      gymDays: JSON.stringify([1, 3, 5]),
      gymPlan: JSON.stringify(['سینه و سه‌سر', 'پا و شکم', 'زیربغل و دوش']),
    },
  });

  return NextResponse.json({ success: true });
}
