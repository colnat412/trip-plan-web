'use client';

import { useState } from 'react';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { useTranslations } from 'next-intl';
import { useTripContext } from '@/features/trip/context/TripContext';
import { useUserContext } from '@/features/user/context/UserContext';
import ShareTripDialog from '@/features/trip/components/ShareTripDialog';
import { TRIP_SHARING_ENABLED } from '@/features/trip/constants/trip-features';
import AppTripSwitcher from './AppTripSwitcher';

const AppTripBar = () => {
  const t = useTranslations('navigation');
  const { activeTrip, openMembers } = useTripContext();
  const { user } = useUserContext();
  const [shareOpen, setShareOpen] = useState(false);
  const isOwner = user?.id != null && activeTrip != null && String(user.id) === String(activeTrip.ownerId);
  return <>
    <Box sx={{ flex: { xs: '1 1 0', sm: '0 1 400px' }, maxWidth: 400, minWidth: 0 }}>
      <AppTripSwitcher actions={activeTrip ? <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        {TRIP_SHARING_ENABLED && isOwner && <Tooltip title={t('shareTrip')}><IconButton aria-label={t('shareTrip')} onClick={() => setShareOpen(true)} sx={{ width: 44, height: 44 }}><ShareRoundedIcon /></IconButton></Tooltip>}
        <Tooltip title={t('members')}><IconButton color="primary" aria-label={t('members')} onClick={() => openMembers(false)} sx={{ width: 44, height: 44 }}><GroupRoundedIcon /></IconButton></Tooltip>
      </Stack> : undefined} />
    </Box>
    {TRIP_SHARING_ENABLED && activeTrip && isOwner && <ShareTripDialog key={activeTrip.id} open={shareOpen} onClose={() => setShareOpen(false)} tripId={activeTrip.id} tripName={activeTrip.name} />}
  </>;
};
export default AppTripBar;
