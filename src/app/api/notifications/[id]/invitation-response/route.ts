import type { NextRequest } from 'next/server';
import { proxyNotification } from '@/features/notification/api/notification-proxy.server';

interface POSTContextParams { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, context: POSTContextParams) {
  const { id } = await context.params;
  return proxyNotification(request, `notifications/${encodeURIComponent(id)}/invitation-response`);
}
