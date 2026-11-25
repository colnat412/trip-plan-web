import 'server-only';
import type { NextRequest } from 'next/server';

/** Device display hints only. Do not forward browser Authorization or proxy/IP headers. */
export function sessionClientHeaders(request: NextRequest) {
  return {
    'User-Agent': (request.headers.get('user-agent') || '').slice(0, 512),
    'X-Vivu-Client': request.headers.get('x-vivu-client') === 'PWA' ? 'PWA' : 'WEB',
  };
}
