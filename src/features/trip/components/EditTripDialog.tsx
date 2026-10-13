'use client';

import { useState } from 'react';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import { useTranslations } from 'next-intl';

import { AppDialog, AppToast } from '@/base/components/ui';
import EditTripForm from './EditTripForm';
import type { Trip } from '../types';

export interface EditTripDialogProps {
  open: boolean;
  onClose: () => void;
  trip: Trip | null;
  onSuccess?: (updatedTrip: Trip) => void;
}

const EditTripDialog = ({
  open,
  onClose,
  trip,
  onSuccess,
}: EditTripDialogProps) => {
  const t = useTranslations('myTrips');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <AppDialog
        mobileFullScreen
        open={open && Boolean(trip)}
        onClose={onClose}
        closeDisabled={busy}
        title={t('editTitle')}
        description={t('editDescription')}
        icon={<EditCalendarRoundedIcon />}
        maxWidth="sm"
      >
        {open && trip && (
          <EditTripForm
            key={trip.id}
            trip={trip}
            onClose={onClose}
            onBusyChange={setBusy}
            onSuccess={(updated) => {
              setSaved(true);
              onSuccess?.(updated);
            }}
          />
        )}
      </AppDialog>
      <AppToast
        open={saved}
        severity="success"
        message={t('updateSuccess')}
        onClose={() => setSaved(false)}
      />
    </>
  );
};

export default EditTripDialog;
