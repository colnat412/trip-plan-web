import { type NextRequest } from 'next/server';
import { proxyTemplate } from '@/features/plan-template/api/template-proxy.server';
interface POSTContextParams { params: Promise<{ id: string }> }

export async function POST(
  request: NextRequest,
  context: POSTContextParams,
) {
  const { id } = await context.params;
  return proxyTemplate(
    request,
    `plan-templates/${encodeURIComponent(id)}/copy`,
    false,
  );
}
