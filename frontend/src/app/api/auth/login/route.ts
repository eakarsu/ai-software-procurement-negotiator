import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, encodeSession } from '@/lib/auth';
import { authenticateDatabaseUser } from '@/lib/databaseAuth';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email ?? '';
  const password = body?.password ?? '';

  const user = await authenticateDatabaseUser(email, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ user });
  response.cookies.set(AUTH_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.SESSION_COOKIE_SECURE === 'true',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return response;
}
