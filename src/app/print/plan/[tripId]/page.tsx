import PlanPrintView from '@/features/plan/components/PlanPrintView/PlanPrintView';

interface PlanPrintPageProps {
  params: Promise<{ tripId: string }>;
}

const PlanPrintPage = async ({ params }: PlanPrintPageProps) => {
  const { tripId } = await params;

  return <PlanPrintView tripId={tripId} />;
};

export default PlanPrintPage;
