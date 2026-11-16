import TemplateLibrary from '@/features/plan-template/components/TemplateLibrary';
import { getPublicTemplateData } from '@/features/plan-template/api/templates.server';
import type { TemplateListing } from '@/features/plan-template/types';
export default async function TemplatesPage() {
  const result = await getPublicTemplateData<TemplateListing>('?size=12');
  return <TemplateLibrary initialData={result.data} />;
}
