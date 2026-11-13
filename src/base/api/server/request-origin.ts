import type { NextRequest } from 'next/server';

/** Compare against the incoming authority, since Next's URL may use localhost. */
export function hasSameRequestOrigin(request: Pick<NextRequest, 'headers' | 'nextUrl'>): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host || /[\s,/@\\?#]/.test(host)) return false;
  if (!['http:', 'https:'].includes(request.nextUrl.protocol)) return false;

  try {
    const source = new URL(origin);
    const target = new URL(`${request.nextUrl.protocol}//${host}`);
    return source.origin === origin && source.origin === target.origin;
  } catch {
    return false;
  }
}
