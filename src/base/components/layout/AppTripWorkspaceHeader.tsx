'use client';

import { IconButton, Tooltip } from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import { useTranslations } from 'next-intl';
import { useTripContext } from '@/features/trip/context/TripContext';
import { formatDateRange } from '@/base/utils';
import AppBackHeader from '../ui/AppBackHeader';

const AppTripWorkspaceHeader = () => {
  const t = useTranslations('navigation');
  const { activeTrip, openMembers } = useTripContext();
  return <AppBackHeader title={activeTrip?.name ?? t('chooseTrip')} titleAlign="left" backHref="/trips"
    description={activeTrip ? formatDateRange(activeTrip.startDate, activeTrip.endDate) : undefined}
    actions={activeTrip ? <Tooltip title={t('members')}><IconButton color="primary" aria-label={t('members')} onClick={() => openMembers(false)} sx={{ width: 44, height: 44 }}><GroupRoundedIcon sx={{ fontSize: 20 }} /></IconButton></Tooltip> : undefined} />;
};
export default AppTripWorkspaceHeader;
