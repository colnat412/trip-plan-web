import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return NextResponse.json({ status: 401, message: 'Unauthorized', data: null }, { status: 401 });
  const coreBase = process.env.CORE_API_BASE_URL
    || `${process.env.CORE_SERVICE_URL || process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081'}/api`;
  try {
    const csrf = request.cookies.get('WS-XSRF-TOKEN')?.value;
    const upstream = await axios.get(`${coreBase.replace(/\/$/, '')}/realtime/bootstrap`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(csrf ? { Cookie: `WS-XSRF-TOKEN=${encodeURIComponent(csrf)}` } : {}),
      },
      timeout: 15000,
    });
    const response = NextResponse.json(upstream.data, { headers: { 'Cache-Control': 'no-store' } });
    // Preserve separate Set-Cookie headers; a comma split corrupts cookie Expires values.
    for (const cookie of upstream.headers['set-cookie'] || []) {
      const secureCookie = process.env.NODE_ENV === 'production' && !/;\s*Secure(?:;|$)/i.test(cookie)
        ? `${cookie}; Secure` : cookie;
      response.headers.append('Set-Cookie', secureCookie);
    }
    return response;
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status || 502 : 502;
    return NextResponse.json({ status, message: 'Realtime unavailable', data: null },
      { status, headers: { 'Cache-Control': 'no-store' } });
  }
}
