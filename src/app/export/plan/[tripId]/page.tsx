import PlanImageExport from '@/features/plan/components/PlanImageExport/PlanImageExport';

const PlanExportPage = async ({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) => {
  const { tripId } = await params;
  return <PlanImageExport key={tripId} tripId={tripId} />;
};
export default PlanExportPage;
