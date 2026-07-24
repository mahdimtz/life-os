'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    fetch('/api/auth')
      .then((res) => {
        if (res.ok) {
          router.push('/');
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'خطا در ورود');
        setLoading(false);
        return;
      }

      if (data.isFirstTime) {
        setIsFirstTime(true);
        setTimeout(() => router.push('/'), 1500);
      } else {
        router.push('/');
      }
    } catch {
      setError('خطا در اتصال به سرور');
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm !p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mx-auto">
            <Lock className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-text">Life<span className="text-accent">OS</span></h1>
          <p className="text-sm text-muted">
            {isFirstTime
              ? 'رمز عبور با موفقیت تنظیم شد!'
              : 'برای ورود رمز عبور رو وارد کن'}
          </p>
        </div>

        {!isFirstTime && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-text-secondary">رمز عبور</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="رمز عبور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p className="text-xs text-danger">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !password.trim()}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'ورود'
              )}
            </Button>

            <p className="text-[10px] text-muted text-center">
              اولین باره وارد میشی؟ رمز عبور دلخواهت رو وارد کن تا تنظیم بشه.
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
