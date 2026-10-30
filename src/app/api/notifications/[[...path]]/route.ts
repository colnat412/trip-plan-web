import { NextResponse, type NextRequest } from 'next/server';
import { forwardNotification } from '@/features/notification/api/forward.server';

type Context = { params: Promise<{ path?: string[] }> };

async function forward(request: NextRequest, context: Context, method: 'GET' | 'PATCH') {
  const { path = [] } = await context.params;
  const value = path.join('/');
  const allowed = method === 'GET'
    ? /^(?:|snapshot|unread-count|[a-zA-Z0-9]+\/target)$/.test(value)
    : /^(?:read-all|[a-zA-Z0-9]+\/read)$/.test(value);
  if (!allowed) return NextResponse.json({ status: 404, message: 'Not found', data: null }, { status: 404 });
  return forwardNotification(request, value ? `/${value}` : '', method);
}
export async function GET(request: NextRequest, context: Context) { return forward(request, context, 'GET'); }
export async function PATCH(request: NextRequest, context: Context) { return forward(request, context, 'PATCH'); }
