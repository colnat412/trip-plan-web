import TemplatePlanEntry from '@/features/plan-template/components/TemplatePlanEntry';

const PlanPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    tripId?: string;
    dayId?: string;
    ai?: string;
    publish?: string;
  }>;
}) => {
  const params = await searchParams;
  return (
    <TemplatePlanEntry
      tripId={params.tripId}
      dayId={params.dayId}
      ai={params.ai === '1'}
      publish={params.publish === '1'}
    />
  );
};

export default PlanPage;
