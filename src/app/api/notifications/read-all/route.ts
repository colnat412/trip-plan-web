import type { NextRequest } from 'next/server';
import { proxyNotification } from '@/features/notification/api/notification-proxy.server';

export async function POST(request: NextRequest) {
  return proxyNotification(request, 'notifications/read-all');
}
