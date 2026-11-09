import { CORE_SERVICE_URL } from '@/base/api/server/backend';
import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const headers = { 'Cache-Control': 'no-store' };
  const token = request.cookies.get('access_token')?.value;
  if (!token) return NextResponse.json({ status: 401, message: 'Unauthorized', data: null }, { status: 401, headers });
  const { id } = await context.params;
  try {
    const response = await axios.get(`${CORE_SERVICE_URL}/api/trip/${encodeURIComponent(id)}/weather`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      timeout: 25000,
      signal: request.signal,
    });
    return NextResponse.json(response.data, { status: response.status, headers });
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status ?? 503 : 503;
    return NextResponse.json({ status, message: 'Weather unavailable', data: null }, { status, headers });
  }
}
