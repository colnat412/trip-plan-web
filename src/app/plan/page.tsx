import TemplatePlanEntry from '@/features/plan-template/components/TemplatePlanEntry';
export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ tripId?: string; ai?: string; publish?: string }>;
}) {
  const params = await searchParams;
  return (
    <TemplatePlanEntry
      tripId={params.tripId}
      ai={params.ai === '1'}
      publish={params.publish === '1'}
    />
  );
}
