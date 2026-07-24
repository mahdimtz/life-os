'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  BatteryLow, Flame, CloudRain, Wind, RotateCcw, Play, ChevronDown, ChevronUp, Zap, Heart,
} from 'lucide-react';

interface Operation {
  id: string;
  icon: React.ElementType;
  color: string;
  colorBg: string;
  borderAccent: string;
  title: string;
  tagline: string;
  explanation: string;
  emergencyPlan: { title: string; steps: string[] };
  recovery: { title: string; steps: string[] };
  example: string;
}

const operations: Operation[] = [
  {
    id: 'fatigue', icon: BatteryLow, color: 'text-amber-400', colorBg: 'bg-amber-400/10', borderAccent: 'border-amber-400/20',
    title: 'پروتکل خستگی', tagline: 'خیلی خسته‌ام',
    explanation: 'بدنت به ریکاوری نیاز داره، نه استراحت. کارهای کوچیک وقتی انرژی کمه رو حفظ می‌کنن.',
    emergencyPlan: { title: 'برنامه اضطراری', steps: ['مطالعه رو به ۱۵ دقیقه کاهش بده — فقط حاضر شو', 'به جای باشگاه پیاده‌روی کن — آرام حرکت کن', 'امروز زود بخواب — بدون مذاکره', 'ثبات رو جشن بگیر — هنوز حاضر شدی'] },
    recovery: { title: 'چک‌لیست ریکاوری', steps: ['آب بخور — یه لیوان پر', '۲۰ دقیقه چرت بزن — آلارم بذار', 'کشش سبک — ۵ دقیقه، چیز سنگینی نیست', 'هوای تازه — ۲ دقیقه بیرون برو'] },
    example: 'هفته پیش خسته بودی ولی بازم ۱۵ دقیقه انگلیسی خوندی. این یه رأیه.',
  },
  {
    id: 'urge', icon: Flame, color: 'text-red-400', colorBg: 'bg-red-400/10', borderAccent: 'border-red-400/20',
    title: 'پروتکل وسوسه', tagline: 'می‌خوام ول کنم',
    explanation: 'وسوسه‌ها رد می‌شن. همیشه رد می‌شن. کار تو فقط صبر کردن و هدایت انرژیه.',
    emergencyPlan: { title: 'برنامه اضطراری', steps: ['تایمر ۱۰ دقیقه بذار — موج رو سوار شو', '۱۰ شنا سوئدی بزن — انرژی رو هدایت کن', 'چرا شروع کردی رو بنویس — دوباره وصل شو', 'به کسی که احترام میذاری پیام بده'] },
    recovery: { title: 'چک‌لیست ریکاوری', steps: ['دوش آب سرد — سیستم عصبی رو ریست کن', 'زنگ بزن — منزوی نشو', 'اهدافت رو ببین — نسخه فیزیکی', 'بنویس چه چیزی وسوسه رو ایجاد کرد'] },
    example: 'هفته پیش وسوسه شدید بود. ۱۰ شنا زدی و چرایی‌ت رو نوشتی. وسوسه بعد از ۸ دقیقه رد شد.',
  },
  {
    id: 'sadness', icon: CloudRain, color: 'text-blue-400', colorBg: 'bg-blue-400/10', borderAccent: 'border-blue-400/20',
    title: 'پروتکل غم', tagline: 'حس بدی دارم',
    explanation: 'غم اطلاعاته، نه حکم. بهت میگه یه چیزی مهمه. احترام بذار، بعد حرکت کن.',
    emergencyPlan: { title: 'برنامه اضطراری', steps: ['۵ دقیقه پیاده‌روی — حرکت شیمی رو تغییر میده', '۳ چیزی که ممنونی رو بنویس — الگو رو بشکن', 'یه آهنگ گوش بده — اجازه بده حس کنی، بعد رها کن', 'یه کار کوچیک انجام بده — سکون رو می‌شکنه'] },
    recovery: { title: 'چک‌لیست ریکاوری', steps: ['ژورنال بنویس — از سرت خالی کن', 'به دوست زنگ بزن — ارتباط شفا میده', 'ورزش سبک — پیاده‌روی، کشش، یوگا', 'زودتر بخواب — احساسات به استراحت نیاز دارن'] },
    example: 'پنجشنبه حس بدی داشتی. ۳ چیزی که ممنونی رو نوشتی، پیاده‌روی رفتی. تا شب بهتر شدی.',
  },
  {
    id: 'anxiety', icon: Wind, color: 'text-purple-400', colorBg: 'bg-purple-400/10', borderAccent: 'border-purple-400/20',
    title: 'پروتکل اضطراب', tagline: 'تحت فشارم',
    explanation: 'اضطراب در آینده زندگی می‌کنه. خودت رو به ۳۰ دقیقه بعدی بیار. فقط همین رو باید مدیریت کنی.',
    emergencyPlan: { title: 'برنامه اضطراری', steps: ['تنفس ۴-۷-۸ — ۴ ثانیه دم، ۷ ثانیه نگه‌دار، ۸ ثانیه بازدم، ۳ بار', 'فقط ۳ اولویت اول رو لیست کن — بقیه رو نادیده بگیر', 'روی ۳۰ دقیقه بعدی تمرکز کن — فراتر نرو', 'نگرانی رو بنویس — بیرونیش کن'] },
    recovery: { title: 'چک‌لیست ریکاوری', steps: ['مدیتیشن — ۱۰ دقیقه، راهنما یا سکوت', 'آرامش تدریجی عضلات — منقبض و رها کن', 'زمان صفحه‌نمایش رو کم کن — ورودی‌ها اضطراب رو تقویت می‌کنن', 'بلند حرف بزن — وقتی بلند میگی کوچیک میشه'] },
    example: 'اضطراب امتحان شدید بود. تنفس ۴-۷-۸ زدی، ۳ موضوع انتخاب کردی، یکی رو خوندی. قبول شدی.',
  },
  {
    id: 'failure', icon: RotateCcw, color: 'text-orange-400', colorBg: 'bg-orange-400/10', borderAccent: 'border-orange-400/20',
    title: 'پروتکل شکست', tagline: 'امروز شکست خوردم',
    explanation: 'شکست داده‌ست. فاصله رو نشون میده. بستن اون فاصله کاره. تو خراب نیستی — داری یاد می‌گیری.',
    emergencyPlan: { title: 'برنامه اضطراری', steps: ['خودت رو ببخش — به معنای واقعی کلمه بنویس «من خودم رو می‌بخشم برای...»', 'یه درس پیدا کن — فقط یکی، مشخص باشه', 'اولین قدم فردات رو برنامه‌ریزی کن — یه قدم مشخص', 'به خودت یادآوری کن: شکست خوردن ≠ شکست، ول کردن شکسته'] },
    recovery: { title: 'چک‌لیست ریکاوری', steps: ['ببین قبلاً چی کار می‌کردی — مدرک تواناییت داری', 'با کوچیک‌ترین کار شروع کن — زنجیره رو دوباره بساز', 'با کسی حرف بزن — شرم در نور کوچیک میشه', 'بنویس به دوستت چی می‌گفتی در این شرایط'] },
    example: '۵ روز باشگاه نرفتی. به جای ول کردن، درس رو نوشتی، یه پیاده‌روی برنامه‌ریزی کردی. روز ۶ برگشتی.',
  },
  {
    id: 'restart', icon: Play, color: 'text-green-400', colorBg: 'bg-green-400/10', borderAccent: 'border-green-400/20',
    title: 'پروتکل شروع دوباره', tagline: 'باید از اول شروع کنم',
    explanation: 'هر استادی یه زمانی فاجعه بود. شروع دوباره شکست نیست — بالغ‌ترین کاریه که می‌تونی بکنی.',
    emergencyPlan: { title: 'برنامه اضطراری', steps: ['ماموریت امروزت رو بنویس — فقط یکی', 'الان انجامش بده — منتظر انگیزه نمونا', 'سکونت بساز — برد‌های کوچیک سریع جمع می‌شن', 'شروع دوباره رو جشن بگیر — شجاعت می‌خواد'] },
    recovery: { title: 'چک‌لیست ریکاوری', steps: ['ارزش‌های هویتیت رو مرور کن — داری به چه کسی تبدیل میشی؟', '۳ هدف ریز تعیین کن — اونقدر کوچیک که نشه شکست خورد', 'به یکی بگو شروع کردی — مسئولیت‌پذیری + غرور', 'این تاریخ رو بنویس — تو آینده ممنونت میشه'] },
    example: 'ما پیش کل سیستم رو ریستارت کردی. الان ۲۲ روزه پیاپی. ریستارت جواب میده.',
  },
];

function OperationCard({ op }: { op: Operation }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = op.icon;

  return (
    <Card className={`transition-all duration-300 cursor-pointer hover:border-opacity-60 ${op.borderAccent} ${expanded ? 'ring-1 ring-white/5' : ''}`}>
      <div onClick={() => setExpanded(!expanded)}>
        <CardHeader className="mb-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${op.colorBg}`}>
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${op.color}`} />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base">{op.title}</CardTitle>
              <p className="text-xs sm:text-sm text-text-secondary mt-0.5">{op.tagline}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CardHeader>
      </div>

      {expanded && (
        <div className="mt-4 sm:mt-6 space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{op.explanation}</p>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <Zap className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${op.color}`} />
              <h4 className="text-xs sm:text-sm font-semibold text-text">{op.emergencyPlan.title}</h4>
            </div>
            <ol className="space-y-1.5 sm:space-y-2">
              {op.emergencyPlan.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full ${op.colorBg} ${op.color} flex items-center justify-center text-[10px] sm:text-xs font-bold mt-0.5`}>{i + 1}</span>
                  <span className="text-text-secondary">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${op.color}`} />
              <h4 className="text-xs sm:text-sm font-semibold text-text">{op.recovery.title}</h4>
            </div>
            <ol className="space-y-1.5 sm:space-y-2">
              {op.recovery.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full ${op.colorBg} ${op.color} flex items-center justify-center text-[10px] sm:text-xs font-bold mt-0.5`}>{i + 1}</span>
                  <span className="text-text-secondary">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className={`rounded-xl ${op.colorBg} p-3 sm:p-4 border ${op.borderAccent}`}>
            <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed">&ldquo;{op.example}&rdquo;</p>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function OperationsPage() {
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">مرکز عملیات</h1>
            <p className="text-muted text-xs sm:text-sm">پروتکل، نه انگیزه</p>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-2 sm:gap-3 px-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] sm:text-xs text-muted uppercase tracking-wider font-medium">الان چه حسی داری؟</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {operations.map((op) => (
          <OperationCard key={op.id} op={op} />
        ))}
      </div>

      <div className="text-center py-6 sm:py-8 space-y-2">
        <p className="text-xs sm:text-sm text-muted">&ldquo;کار این نیست که چیزی رو ببینی که هرگز دیده نشده، بلکه اینه که درباره چیزی که هر روز می‌بینیم، چیزی فکر کنیم که هرگز فکر نکردیم.&rdquo;</p>
        <p className="text-[10px] sm:text-xs text-muted/60">— اروین شرودینگر</p>
      </div>
    </div>
  );
}
