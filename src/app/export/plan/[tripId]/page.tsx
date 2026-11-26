import PlanImageExport from '@/features/plan/components/PlanImageExport/PlanImageExport';

interface PlanExportPageProps {
  params: Promise<{ tripId: string }>;
}

const PlanExportPage = async ({
  params,
}: PlanExportPageProps) => {
  const { tripId } = await params;
  return <PlanImageExport key={tripId} tripId={tripId} />;
};
export default PlanExportPage;
