import type { NextRequest } from 'next/server';
import { forwardIdentity, identityError } from '@/base/api/server/identity';

export async function PATCH(request: NextRequest) {
  if (!request.cookies.get('access_token')?.value)
    return identityError(401, 'Unauthorized');
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return identityError(400, 'Invalid JSON');
  }
  return forwardIdentity(request, '/users/me/avatar', 'PATCH', body);
}

export async function DELETE(request: NextRequest) {
  return forwardIdentity(request, '/users/me/avatar', 'DELETE');
}
