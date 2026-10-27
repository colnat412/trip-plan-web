import 'server-only';
import type { ApiResponse } from '@/base/api';
const core =
  process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';
export async function getPublicTemplateData<T>(
  path: string,
): Promise<{ data: T | null; status: number }> {
  try {
    const response = await fetch(`${core}/api/public/plan-templates${path}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return { data: null, status: response.status };
    const body: ApiResponse<T> = await response.json();
    return { data: body.data, status: response.status };
  } catch {
    return { data: null, status: 503 };
  }
}
