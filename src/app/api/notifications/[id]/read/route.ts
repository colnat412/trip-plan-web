import type { NextRequest } from 'next/server';
import { proxyNotification } from '@/features/notification/api/notification-proxy.server';

interface PATCHContextParams { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, context: PATCHContextParams) {
  const { id } = await context.params;
  return proxyNotification(request, `notifications/${encodeURIComponent(id)}/read`);
}
