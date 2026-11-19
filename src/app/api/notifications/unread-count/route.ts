import type { NextRequest } from 'next/server';
import { proxyNotification } from '@/features/notification/api/notification-proxy.server';

export async function GET(request: NextRequest) {
  return proxyNotification(request, 'notifications/unread-count');
}
