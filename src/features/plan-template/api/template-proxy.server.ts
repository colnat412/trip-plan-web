import 'server-only';
import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
const core =
  process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';
export async function proxyTemplate(
  request: NextRequest,
  path: string,
  isPublic = false,
) {
  const token = request.cookies.get('access_token')?.value;
  if (!isPublic && !token)
    return NextResponse.json(
      { status: 401, message: 'Unauthorized', data: null },
      { status: 401 },
    );
  if (
    request.method !== 'GET' &&
    request.headers.get('origin') !== request.nextUrl.origin
  )
    return NextResponse.json(
      { status: 403, message: 'Invalid origin', data: null },
      { status: 403 },
    );
  try {
    const response = await axios.request({
      url: `${core}/api/${path}${request.nextUrl.search}`,
      method: request.method,
      data: request.method === 'GET' ? undefined : await request.json(),
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        ...(!isPublic ? { Authorization: `Bearer ${token}` } : {}),
        ...(request.headers.get('Idempotency-Key')
          ? { 'Idempotency-Key': request.headers.get('Idempotency-Key')! }
          : {}),
      },
    });
    return NextResponse.json(response.data, {
      status: response.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response)
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    return NextResponse.json(
      { status: 503, message: 'Template service unavailable', data: null },
      { status: 503 },
    );
  }
}
