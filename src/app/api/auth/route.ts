import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Store valid tokens in memory (in production, use Redis or database)
const validTokens = new Set<string>();

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  let settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });

  // If no password set, this is first time - set the password
  if (!settings?.password) {
    const hashedPassword = hashPassword(password);
    settings = await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: { password: hashedPassword },
      create: {
        id: 'singleton',
        password: hashedPassword,
        identityValues: JSON.stringify(['انضباط', 'پشتکار', 'شجاعت', 'رشد', 'تمرکز']),
        gymDays: '[]',
        gymPlan: '[]',
      },
    });

    const token = createToken();
    validTokens.add(token);

    const response = NextResponse.json({ success: true, isFirstTime: true });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  // Verify password
  const hashedPassword = hashPassword(password);
  if (hashedPassword !== settings.password) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = createToken();
  validTokens.add(token);

  const response = NextResponse.json({ success: true, isFirstTime: false });
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth-token');
  return response;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value;

  if (!token || !validTokens.has(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

export { validTokens };
