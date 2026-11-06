import { CORE_SERVICE_URL } from '@/base/api/server/backend';
import 'server-only';
import type { ApiResponse } from '@/base/api';
const core = CORE_SERVICE_URL;
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
