import { NextResponse, type NextRequest } from 'next/server';
import { proxyTemplate } from '@/features/plan-template/api/template-proxy.server';
export async function GET(request: NextRequest) {
  if (!request.cookies.get('access_token')?.value && !request.cookies.get('refresh_token')?.value) {
    return NextResponse.json({ status: 200, message: 'Guest', data: [], authenticated: false }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  return proxyTemplate(request, 'me/plan-template-saves/status', false);
}
