import type { NextRequest } from 'next/server';
import { proxyNotification } from '@/features/notification/api/notification-proxy.server';

interface DELETEContextParams { params: Promise<{ id: string }> }

export async function DELETE(request: NextRequest, context: DELETEContextParams) {
  const { id } = await context.params;
  return proxyNotification(request, `push-devices/${encodeURIComponent(id)}`);
}
