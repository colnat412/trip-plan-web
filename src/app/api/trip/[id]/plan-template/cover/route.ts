import type { NextRequest } from 'next/server';
import { proxyTemplate } from '@/features/plan-template/api/template-proxy.server';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return proxyTemplate(request, `trip/${encodeURIComponent(id)}/plan-template/cover`, false);
}
