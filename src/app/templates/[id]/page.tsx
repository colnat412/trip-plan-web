import TemplateDetail from '@/features/plan-template/components/TemplateDetail';
import { getPublicTemplateData } from '@/features/plan-template/api/templates.server';
import type { TemplateDetailData } from '@/features/plan-template/types';
interface TemplatePageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplatePage({
  params,
}: TemplatePageProps) {
  const { id } = await params;
  const result = await getPublicTemplateData<TemplateDetailData>(
    `/${encodeURIComponent(id)}`,
  );
  return <TemplateDetail detail={result.data} status={result.status} />;
}
