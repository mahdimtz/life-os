import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const SECRET = process.env.AUTH_SECRET || 'lifeos-personal-app-secret-key-2024';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createSignedToken(passwordHash: string): string {
  const payload = `${passwordHash}:${Date.now()}`;
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

function verifySignedToken(token: string, passwordHash: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length < 3) return false;
    const [storedHash, timestamp, signature] = [parts[0], parts.slice(1, -1).join(':'), parts[parts.length - 1]];
    const expectedSig = crypto.createHmac('sha256', SECRET).update(`${storedHash}:${timestamp}`).digest('hex');
    if (signature !== expectedSig) return false;
    if (storedHash !== passwordHash) return false;
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > 30 * 24 * 60 * 60 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    let settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });

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

      const token = createSignedToken(hashedPassword);
      const response = NextResponse.json({ success: true, isFirstTime: true });
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    const hashedPassword = hashPassword(password);
    if (hashedPassword !== settings.password) {
      return NextResponse.json({ error: 'رمز عبور اشتباه است' }, { status: 401 });
    }

    const token = createSignedToken(hashedPassword);
    const response = NextResponse.json({ success: true, isFirstTime: false });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    console.error('[POST /api/auth]', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth-token');
  return response;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
    if (!settings?.password) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!verifySignedToken(token, settings.password)) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('[GET /api/auth]', error);
    return NextResponse.json({ error: 'Auth check failed' }, { status: 500 });
  }
}
