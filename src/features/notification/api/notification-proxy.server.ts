import 'server-only';
import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
import { CORE_SERVICE_URL } from '@/base/api/server/backend';
import { hasSameRequestOrigin } from '@/base/api/server/request-origin';

export const proxyNotification = async (request: NextRequest, path: string) => {
  const headers = { 'Cache-Control': 'no-store' };
  const fail = (status: number, message: string) => NextResponse.json({ status, message, data: null }, { status, headers });
  const token = request.cookies.get('access_token')?.value;
  if (!token) return fail(401, 'Unauthorized');
  if (request.method !== 'GET' && !hasSameRequestOrigin(request)) return fail(403, 'Invalid origin');
  let body: unknown;
  if (request.method === 'POST' || request.method === 'PUT') {
    if (Number(request.headers.get('content-length') ?? 0) > 16384) return fail(413, 'Payload too large');
    try { body = await request.json(); } catch { return fail(400, 'Invalid JSON'); }
  }
  try {
    const response = await axios.request({
      url: `${CORE_SERVICE_URL}/api/${path}${request.nextUrl.search}`,
      method: request.method, data: body, timeout: 15000,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    return NextResponse.json(response.data, { status: response.status, headers });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) return NextResponse.json(error.response.data, { status: error.response.status, headers });
    return fail(503, 'Notification service unavailable');
  }
};
