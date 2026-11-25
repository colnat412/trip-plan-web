import type { NextRequest } from 'next/server';
import { forwardIdentity, identityError } from '@/base/api/server/identity';
import { hasSameRequestOrigin } from '@/base/api/server/request-origin';

export async function DELETE(request: NextRequest) {
  if (!request.cookies.get('access_token')?.value) return identityError(401, 'Unauthorized');
  if (!hasSameRequestOrigin(request)) return identityError(403, 'Invalid origin');
  let body: unknown;
  try { body = await request.json(); } catch { return identityError(400, 'Invalid JSON'); }
  if (!body || typeof body !== 'object') return identityError(400, 'Invalid request');
  const { confirmed } = body as Record<string, unknown>;
  if (confirmed !== true) return identityError(400, 'Invalid confirmation');
  const response = await forwardIdentity(request, '/users/me', 'DELETE', { confirmed: true });
  response.headers.set('Cache-Control', 'no-store');
  if (response.ok) {
    for (const name of ['access_token', 'refresh_token'])
      response.cookies.set(name, '', { httpOnly: true, path: '/', maxAge: 0, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  }
  return response;
}
