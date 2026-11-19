import type { NextRequest } from 'next/server';
import { proxyNotification } from '@/features/notification/api/notification-proxy.server';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return proxyNotification(request, `notifications/${encodeURIComponent(id)}/read`);
}
