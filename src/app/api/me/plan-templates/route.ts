import { type NextRequest } from 'next/server';
import { proxyTemplate } from '@/features/plan-template/api/template-proxy.server';
export async function GET(request: NextRequest) {
  return proxyTemplate(request, `me/plan-templates`, false);
}
