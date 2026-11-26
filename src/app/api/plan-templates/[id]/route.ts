import { type NextRequest } from 'next/server';
import { proxyTemplate } from '@/features/plan-template/api/template-proxy.server';
interface PUTContextParams { params: Promise<{ id: string }> }

export async function PUT(
  request: NextRequest,
  context: PUTContextParams,
) {
  const { id } = await context.params;
  return proxyTemplate(
    request,
    `plan-templates/${encodeURIComponent(id)}`,
    false,
  );
}
