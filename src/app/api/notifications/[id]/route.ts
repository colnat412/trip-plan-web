import type { NextRequest } from 'next/server';
import { proxyNotification } from '@/features/notification/api/notification-proxy.server';

interface GETContextParams { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: GETContextParams) {
  const { id } = await context.params;
  return proxyNotification(request, `notifications/${encodeURIComponent(id)}`);
}

interface DELETEContextParams { params: Promise<{ id: string }> }

export async function DELETE(request: NextRequest, context: DELETEContextParams) {
  const { id } = await context.params;
  return proxyNotification(request, `notifications/${encodeURIComponent(id)}`);
}
