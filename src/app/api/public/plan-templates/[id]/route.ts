import { type NextRequest } from 'next/server';
import { proxyTemplate } from '@/features/plan-template/api/template-proxy.server';
interface GETContextParams { params: Promise<{ id: string }> }

export async function GET(
  request: NextRequest,
  context: GETContextParams,
) {
  const { id } = await context.params;
  return proxyTemplate(
    request,
    `public/plan-templates/${encodeURIComponent(id)}`,
    true,
  );
}
