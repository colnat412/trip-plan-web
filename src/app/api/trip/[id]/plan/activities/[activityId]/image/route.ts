import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';
import { CORE_SERVICE_URL } from '@/base/api/server/backend';

export async function PATCH(request: NextRequest, context: {
  params: Promise<{ id: string; activityId: string }>;
}) {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return NextResponse.json({ status: 401, message: 'Unauthorized', data: null }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ status: 400, message: 'Invalid JSON', data: null }, { status: 400 }); }
  const { id, activityId } = await context.params;
  try {
    const response = await axios.patch(
      `${CORE_SERVICE_URL}/api/trip/${encodeURIComponent(id)}/plan/activities/${encodeURIComponent(activityId)}/image`, body,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 30_000, signal: request.signal, maxRedirects: 0 },
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({ status: 502, message: 'Core service unavailable', data: null }, { status: 502 });
  }
}
