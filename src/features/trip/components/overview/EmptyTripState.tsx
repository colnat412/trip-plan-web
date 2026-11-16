'use client';

import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppCard, AppEmptyState } from '@/base/components/ui';

interface EmptyTripStateProps {
  onCreateTrip: () => void;
}

const EmptyTripState = ({ onCreateTrip }: EmptyTripStateProps) => {
  const tTrip = useTranslations('trip');

  return (
    <AppCard
      component="section"
      sx={{
        minWidth: 0,
        p: { xs: 2, md: 3 },
      }}
    >
      <AppEmptyState
        title={tTrip('noTrips')}
        icon={<FlightTakeoffRoundedIcon />}
        action={
          <AppButton
            intent="primary"
            size="medium"
            startIcon={<AddRoundedIcon />}
            onClick={onCreateTrip}
            sx={{ minHeight: 44 }}
          >
            {tTrip('createTrip')}
          </AppButton>
        }
      />
    </AppCard>
  );
};

export default EmptyTripState;
