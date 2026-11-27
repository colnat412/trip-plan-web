"use client";
import { useQueryGet } from "@/base/hooks";
import type { ApiResponse } from "@/base/api";
import type { TemplateDetailData } from "../types";
export default function useTemplateDetail(id: string) {
  const query = useQueryGet<ApiResponse<TemplateDetailData>>({
    queryKey: ["published-template-detail", id],
    endPoint: `/public/plan-templates/${encodeURIComponent(id)}`,
    enabled: !!id,
  });
  return {
    ...query,
    detail: !query.isStale && !query.error ? query.data?.data : null,
  };
}
