import { NextResponse, type NextRequest } from 'next/server';
import { hasSameRequestOrigin } from '@/base/api/server/request-origin';

/** Clear rejected browser credentials locally; do not depend on a live auth service. */
export async function POST(request: NextRequest) {
  if (!hasSameRequestOrigin(request)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const response = NextResponse.json({ status: 200, data: null }, { headers: { 'Cache-Control': 'no-store' } });
  for (const name of ['access_token', 'refresh_token']) {
    response.cookies.set(name, '', { httpOnly: true, path: '/', maxAge: 0, expires: new Date(0) });
  }
  return response;
}
