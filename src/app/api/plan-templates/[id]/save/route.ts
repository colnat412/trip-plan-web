import { type NextRequest } from 'next/server';
import { proxyTemplate } from '@/features/plan-template/api/template-proxy.server';
interface MutateContextParams { params: Promise<{ id: string }> }

async function mutate(request: NextRequest, context: MutateContextParams) {
  const { id } = await context.params;
  return proxyTemplate(request, `plan-templates/${encodeURIComponent(id)}/save`, false);
}
export { mutate as PUT, mutate as DELETE };
