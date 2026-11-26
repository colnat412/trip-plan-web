import { CORE_SERVICE_URL } from '@/base/api/server/backend';
import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

interface GETContextParams { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: GETContextParams) {
  const noStore = { 'Cache-Control': 'no-store' };
  const fail = (status: number, message: string) => NextResponse.json({ status, message, data: null }, { status, headers: noStore });
  const token = request.cookies.get('access_token')?.value;
  if (!token) return fail(401, 'Unauthorized');
  const { id } = await context.params;
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return fail(400, 'Invalid trip');
  const params: Record<string, string> = {};
  for (const [key, allowed] of [['memberStatus', ['ALL', 'OWED', 'OWES', 'SETTLED']], ['historyStatus', ['ALL', 'PENDING', 'CONFIRMED']]] as const) {
    const value = request.nextUrl.searchParams.get(key) ?? 'ALL';
    if (!(allowed as readonly string[]).includes(value)) return fail(400, 'Invalid settlement filter');
    params[key] = value;
  }
  for (const key of ['memberPage', 'historyPage', 'suggestionPage']) {
    const value = request.nextUrl.searchParams.get(key) ?? '0';
    if (!/^\d+$/.test(value) || Number(value) > 5000) return fail(400, 'Invalid page');
    params[key] = value;
  }
  try {
    const response = await axios.get(`${CORE_SERVICE_URL}/api/trip/${id}/settlement/workspace`, {
      params, timeout: 15000, headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    return NextResponse.json(response.data, { status: response.status, headers: noStore });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status, headers: noStore });
    }
    return fail(503, 'Cannot connect to core service');
  }
}
