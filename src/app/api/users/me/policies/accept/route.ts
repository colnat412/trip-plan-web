import type { NextRequest } from 'next/server';
import { forwardIdentity, identityError } from '@/base/api/server/identity';

export async function POST(request: NextRequest) {
  if (!request.cookies.get('access_token')?.value)
    return identityError(401, 'Unauthorized');
  // Accept only same-origin browser
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin)
    return identityError(403, 'Invalid origin');
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return identityError(400, 'Invalid JSON');
  }
  return forwardIdentity(request, '/users/me/policies/accept', 'POST', body);
}
