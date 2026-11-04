import { redirect } from 'next/navigation';

const PlanPrintPage = async ({ params }: { params: Promise<{ tripId: string }> }) => {
  const { tripId } = await params;
  redirect(`/export/plan/${encodeURIComponent(tripId)}`);
};
export default PlanPrintPage;
