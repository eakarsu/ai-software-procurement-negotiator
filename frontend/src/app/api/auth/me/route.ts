import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, decodeSession } from '@/lib/auth';
import { databaseUserIsActive } from '@/lib/databaseAuth';

export async function GET(request: NextRequest) {
  const user = decodeSession(request.cookies.get(AUTH_COOKIE)?.value);
  if (!user || !(await databaseUserIsActive(user.email))) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
