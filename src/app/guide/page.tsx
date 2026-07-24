'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  LayoutDashboard,
  CalendarCheck,
  Target,
  BookOpen,
  Dumbbell,
  NotebookPen,
  Activity,
  BarChart3,
  Settings,
  ArrowLeft,
  Database,
  Layers,
  Workflow,
} from 'lucide-react';

const sections = [
  {
    icon: LayoutDashboard,
    name: 'داشبورد',
    href: '/',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    description: 'نمای کلی از وضعیت فعلی شما',
    details: [
      'سلام و خوشامدگویی بر اساس ساعت روز',
      'نمایش آمار کلیدی: امتیاز روزانه، روزهای متوالی، درصد هویت',
      'مأموریت اصلی: مهم‌ترین وظیفه انجام نشده',
      'لیست وظایف امروز با امکان تیک زدن',
      'برنامه فردا و نمودار هفتگی',
      'پیشرفت و رأی هویت',
    ],
  },
  {
    icon: CalendarCheck,
    name: 'امروز',
    href: '/today',
    color: 'text-success',
    bgColor: 'bg-success/10',
    description: 'مدیریت وظایف امروز و فردا',
    details: [
      'لیست کامل وظایف امروز',
      'نمایش وظایف فردا در بخش جداگانه',
      'افزودن وظیفه جدید برای امروز یا فردا',
      'پیوند وظایف به اهداف',
      'امتیازدهی خودکار بر اساس انجام وظایف',
    ],
  },
  {
    icon: Target,
    name: 'اهداف',
    href: '/goals',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    description: 'تعریف و پیگیری اهداف بلندمدت',
    details: [
      'تعریف اهداف ۱ ساله، ۳ ساله و ۵ ساله',
      'پیشرفت هر هدف با درصد',
      'پیوند اهداف به وظایف روزانه',
      'مهلت زمانی برای هر هدف',
      '追踪 پیشرفت در طول زمان',
    ],
  },
  {
    icon: BookOpen,
    name: 'یادگیری',
    href: '/learning',
    color: 'text-info',
    bgColor: 'bg-info/10',
    description: 'ثبت ساعات مطالعه و یادگیری',
    details: [
      'ثبت ساعات یادگیری در دسته‌بندی‌ها (بک‌اند، فرانت‌اند، زبان انگلیسی، کتاب‌ها)',
      'نمودار پیشرفت یادگیری',
      'آمار کلی ساعات مطالعه',
      'یادداشت‌های مرتبط با یادگیری',
    ],
  },
  {
    icon: Dumbbell,
    name: 'باشگاه',
    href: '/gym',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    description: 'پیگیری تمرینات ورزشی',
    details: [
      'ثبت جلسات باشگاه',
      'برنامه تمرینی شخصی',
      'ردیابی روزهای ورزش',
      'پیوند با امتیاز روزانه',
    ],
  },
  {
    icon: NotebookPen,
    name: 'ژورنال',
    href: '/journal',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    description: 'نوشتن خاطرات و بازتاب روزانه',
    details: [
      'ثبت حال و هوای روز (عالی، خوب، معمولی، بد، خیلی بد)',
      'ثبت سطح انرژی',
      'نوشتن درس‌های آموخته شده',
      'ثبت چیزهایی که بابتشون ممنونی',
      'پیوند با امتیاز روزانه',
    ],
  },
  {
    icon: Activity,
    name: 'عملیات',
    href: '/operations',
    color: 'text-success',
    bgColor: 'bg-success/10',
    description: 'مدیریت عملیات و پروژه‌های فعال',
    details: [
      'ایجاد و مدیریت عملیات',
      'پیگیری وضعیت عملیات',
      'پیوند عملیات به اهداف',
      'برنامه‌ریزی مراحل اجرا',
    ],
  },
  {
    icon: BarChart3,
    name: 'آمار',
    href: '/statistics',
    color: 'text-info',
    bgColor: 'bg-info/10',
    description: 'تحلیل و نمودارهای پیشرفت',
    details: [
      'نمودار امتیاز روزانه',
      'آمار وظایف انجام شده',
      'ساعات یادگیری در طول زمان',
      'روند پیشرفت اهداف',
      'تحلیل رفتار و عادات',
    ],
  },
  {
    icon: Settings,
    name: 'تنظیمات',
    href: '/settings',
    color: 'text-muted',
    bgColor: 'bg-muted/10',
    description: 'سفارشی‌سازی برنامه',
    details: [
      'تعریف ارزش‌های هویتی',
      'تنظیم یادآوری روزانه',
      'روزهای باشگاه',
      'برنامه تمرینی',
      'تنظیمات ظاهری',
    ],
  },
];

const relations = [
  {
    title: 'ارتباط وظایف و اهداف',
    description: 'هر وظیفه می‌تواند به یک هدف پیوند داشته باشد. این پیوند در داشبورد و صفحه اهداف نمایش داده می‌شود.',
    from: 'امروز',
    to: 'اهداف',
    icon: Workflow,
  },
  {
    title: 'محاسبه امتیاز روزانه',
    description: 'امتیاز هر روز بر اساس تعداد وظایف انجام شده، جلسه باشگاه و نوشتن ژورنال محاسبه می‌شود.',
    from: 'امروز + باشگاه + ژورنال',
    to: 'داشبورد + آمار',
    icon: Layers,
  },
  {
    title: 'سیستم هویت',
    description: 'هر بار که طبق ارزش‌هایت عمل می‌کنی، یک رأی ثبت می‌کنی. درصد هویت = تعداد رأی‌ها در ۳۰ روز اخیر.',
    from: 'داشبورد (رأی‌گیری)',
    to: 'تنظیمات (تعریف ارزش‌ها)',
    icon: Target,
  },
  {
    title: 'پایگاه داده',
    description: 'تمام اطلاعات در SQLite ذخیره می‌شود. Prisma ORM برای مدیریت ارتباطات بین مدل‌ها استفاده شده.',
    from: 'تمام بخش‌ها',
    to: 'Prisma + SQLite',
    icon: Database,
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen px-2 sm:px-6 py-6 sm:py-10 max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          بازگشت به داشبورد
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
          راهنمای LifeOS
        </h1>
        <p className="text-muted text-sm">
          آشنایی با بخش‌های مختلف سیستم‌عامل زندگی و ارتباطات بین آن‌ها
        </p>
      </header>

      {/* Sections Grid */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">بخش‌های برنامه</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <Card key={section.href} className="group hover:border-accent/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${section.bgColor}`}>
                    <section.icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{section.name}</CardTitle>
                    <p className="text-xs text-muted">{section.description}</p>
                  </div>
                </div>
              </CardHeader>
              <ul className="space-y-1.5 mt-2">
                {section.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted">
                    <span className="text-accent mt-0.5">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
              <div className="mt-3">
                <Link
                  href={section.href}
                  className="text-xs text-accent hover:underline inline-flex items-center gap-1"
                >
                  رفتن به {section.name}
                  <ArrowLeft size={12} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Relations */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">ارتباطات بین بخش‌ها</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relations.map((rel, i) => (
            <Card key={i} className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
                    <rel.icon className="w-5 h-5 text-accent" />
                  </div>
                  <CardTitle className="text-sm">{rel.title}</CardTitle>
                </div>
              </CardHeader>
              <p className="text-xs text-muted mt-2">{rel.description}</p>
              <div className="flex items-center gap-2 mt-3 text-xs">
                <span className="px-2 py-1 rounded-lg bg-surface text-muted">{rel.from}</span>
                <ArrowLeft size={14} className="text-accent" />
                <span className="px-2 py-1 rounded-lg bg-accent/10 text-accent">{rel.to}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">تکنولوژی‌های استفاده شده</h2>
        <Card>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-sm font-medium text-text">Next.js 16</p>
              <p className="text-xs text-muted">فریمورک فرانت‌اند</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text">Prisma</p>
              <p className="text-xs text-muted">ORM پایگاه داده</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text">SQLite</p>
              <p className="text-xs text-muted">پایگاه داده سبک</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text">Zustand</p>
              <p className="text-xs text-muted">مدیریت وضعیت</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text">Tailwind CSS</p>
              <p className="text-xs text-muted">طراحی رابط کاربری</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text">Recharts</p>
              <p className="text-xs text-muted">نمودارها</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text">TypeScript</p>
              <p className="text-xs text-muted">تایپ ایمن</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text">React 19</p>
              <p className="text-xs text-muted">کتابخانه UI</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
