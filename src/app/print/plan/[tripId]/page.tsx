import { redirect } from 'next/navigation';

interface PlanPrintPageProps { params: Promise<{ tripId: string }> }

const PlanPrintPage = async ({ params }: PlanPrintPageProps) => {
  const { tripId } = await params;
  redirect(`/export/plan/${encodeURIComponent(tripId)}`);
};
export default PlanPrintPage;
