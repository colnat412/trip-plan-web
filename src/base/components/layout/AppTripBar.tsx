'use client';

import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { useTranslations } from 'next-intl';
import { AppButton } from '@/base/components/ui';
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
  const isOwner =
    user?.id != null &&
    activeTrip != null &&
    String(user.id) === String(activeTrip.ownerId);
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          minWidth: 0,
          flex: { xs: '1 1 0', sm: '0 1 400px', xl: '0 1 440px' },
          maxWidth: { sm: 400, xl: 440 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AppTripSwitcher
            actions={
              activeTrip ? (
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    flexWrap: 'wrap',
                    '& > .MuiButton-root': {
                      flex: '1 1 0',
                      minWidth: 0,
                      minHeight: 48,
                      px: 1,
                      borderRadius: '12px',
                    },
                  }}
                >
                  {TRIP_SHARING_ENABLED && isOwner && (
                    <AppButton
                      intent="secondary"
                      size="small"
                      wrapLabel
                      onClick={() => setShareOpen(true)}
                      startIcon={<ShareRoundedIcon />}
                    >
                      {t('shareTrip')}
                    </AppButton>
                  )}
                  <AppButton
                    intent="secondary"
                    size="small"
                    wrapLabel
                    onClick={() => openMembers(false)}
                    startIcon={<GroupRoundedIcon />}
                  >
                    {t('members')}
                  </AppButton>
                </Stack>
              ) : undefined
            }
          />
        </Box>
        {activeTrip && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {TRIP_SHARING_ENABLED && isOwner && (
              <AppButton
                intent="text"
                size="small"
                onClick={() => setShareOpen(true)}
                aria-label={t('shareTrip')}
                title={t('shareTrip')}
                sx={{ minHeight: 44, minWidth: 44, px: 1 }}
              >
                <ShareRoundedIcon sx={{ fontSize: '20px' }} />
              </AppButton>
            )}
            <AppButton
              intent="text"
              size="small"
              onClick={() => openMembers(false)}
              aria-label={t('members')}
              title={t('members')}
              sx={{ minHeight: 44, minWidth: 44, px: 1 }}
            >
              <GroupRoundedIcon sx={{ fontSize: '20px' }} />
            </AppButton>
          </Stack>
        )}
      </Box>
      {TRIP_SHARING_ENABLED && activeTrip && isOwner && (
        <ShareTripDialog
          key={activeTrip.id}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          tripId={activeTrip.id}
          tripName={activeTrip.name}
        />
      )}
    </>
  );
};
export default AppTripBar;
