import type { Metadata } from 'next';
import { APP_NAME } from '@/base/constants/brand';

import PublicTripView from '@/features/trip/components/PublicTripView';
import { getPublicTripSnapshot } from '@/features/trip/api/public-trip.server';

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  const { snapshot } = await getPublicTripSnapshot(token);
  if (!snapshot) return { title: APP_NAME };

  return {
    title: `${snapshot.trip.name} · ${APP_NAME}`,
    description: snapshot.trip.description ?? snapshot.trip.destination,
  };
}

const PublicTripPage = async ({ params }: PageProps) => {
  const { token } = await params;
  const { snapshot, errorStatus } = await getPublicTripSnapshot(token);

  return (
    <PublicTripView
      token={token}
      snapshot={snapshot}
      errorStatus={errorStatus}
    />
  );
};

export default PublicTripPage;
