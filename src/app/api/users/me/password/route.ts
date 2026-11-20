import type { NextRequest } from 'next/server';
import { forwardIdentity, identityError } from '@/base/api/server/identity';
import { hasSameRequestOrigin } from '@/base/api/server/request-origin';

export async function PATCH(request: NextRequest) {
  if (!request.cookies.get('access_token')?.value)
    return identityError(401, 'Unauthorized');
  if (!hasSameRequestOrigin(request))
    return identityError(403, 'Invalid origin');
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return identityError(400, 'Invalid JSON');
  }
  if (!body || typeof body !== 'object') return identityError(400, 'Invalid request');
  const { currentPassword, newPassword } = body as Record<string, unknown>;
  if (typeof newPassword !== 'string' || newPassword.length < 8 || !newPassword.trim()
    || new TextEncoder().encode(newPassword).length > 72
    || (currentPassword !== undefined && typeof currentPassword !== 'string')) {
    return identityError(400, 'Invalid password');
  }
  return forwardIdentity(request, '/users/me/password', 'PATCH', { currentPassword, newPassword });
}
