import 'server-only';
import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';

const identityClient = axios.create({
  baseURL: `${(process.env.IDENTITY_SERVICE_URL || process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL || 'http://localhost:8888').replace(/\/$/, '')}/api`,
  timeout: 90_000,
});

export const identityError = (status: number, message: string) =>
  NextResponse.json({ status, message, data: null }, { status });

export async function forwardIdentity(
  request: NextRequest,
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  data?: unknown,
) {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return identityError(401, 'Unauthorized');
  try {
    const response = await identityClient.request({
      url: path,
      method,
      data,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    return identityError(502, 'Identity service unavailable');
  }
}
