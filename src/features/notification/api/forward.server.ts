import 'server-only';
import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';

const coreBase = process.env.CORE_API_BASE_URL
  || `${process.env.CORE_SERVICE_URL || process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081'}/api`;

export async function forwardNotification(request: NextRequest, path: string, method: 'GET' | 'PATCH') {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return NextResponse.json({ status: 401, message: 'Unauthorized', data: null }, { status: 401 });
  try {
    const response = await axios.request({
      url: `${coreBase.replace(/\/$/, '')}/notifications${path}`,
      method,
      params: method === 'GET' ? Object.fromEntries(request.nextUrl.searchParams) : undefined,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      timeout: 15000,
    });
    return NextResponse.json(response.data, { status: response.status, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status || 502 : 502;
    const body = axios.isAxiosError(error) ? error.response?.data : undefined;
    return NextResponse.json(body || { status, message: 'Cannot load notifications', data: null },
      { status, headers: { 'Cache-Control': 'no-store' } });
  }
}
