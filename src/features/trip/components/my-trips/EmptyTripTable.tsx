'use client';

import { TableCell, TableRow } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppEmptyState } from '@/base/components/ui';

interface EmptyTripTableProps {
  onCreateTrip: () => void;
}

const EmptyTripTable = ({ onCreateTrip }: EmptyTripTableProps) => {
  const t = useTranslations('myTrips');

  return (
    <TableRow>
      <TableCell colSpan={6} sx={{ py: 8, textAlign: 'center' }}>
        <AppEmptyState title={t('emptyTitle')} action={
          <AppButton size="small" intent="primary" startIcon={<AddRoundedIcon />} onClick={onCreateTrip}>{t('createNew')}</AppButton>
        } />
      </TableCell>
    </TableRow>
  );
};

export default EmptyTripTable;
