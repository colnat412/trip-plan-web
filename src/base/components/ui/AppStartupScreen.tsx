'use client';

import Image from 'next/image';
import { Box, Stack, Typography } from '@mui/material';
import FlightRoundedIcon from '@mui/icons-material/FlightRounded';
import { useTranslations } from 'next-intl';
import { LOADING_INDICATOR_SIZE } from '@/base/constants/loading';

const AppStartupScreen = () => {
  const t = useTranslations('loading');
  const tNavigation = useTranslations('navigation');

  return (
    <Box
      role="status"
      aria-label={t('startup')}
      aria-live="polite"
      sx={(theme) => ({
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.modal + 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper',
        color: 'text.primary',
        px: 'max(24px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px))',
        py: 'max(24px, env(safe-area-inset-top, 0px), env(safe-area-inset-bottom, 0px))',
      })}
    >
      <Stack spacing={3} sx={{ alignItems: 'center', width: '100%', maxWidth: 280 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
          <Image src="/icon.svg" alt="" width={48} height={48} priority />
          <Typography component="span" sx={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            {tNavigation('brandName')}
          </Typography>
        </Stack>
        <Stack spacing={1.5} sx={{ alignItems: 'center', width: '100%' }}>
          <Typography sx={{ fontSize: '14px', color: 'text.secondary', textAlign: 'center' }}>
            {t('startup')}
          </Typography>
          <Box aria-hidden="true" sx={{
            width: 160,
            maxWidth: '100%',
            height: 32,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              width: '100%',
              borderTop: '1px dashed',
              borderColor: 'divider',
            }} />
            <Box component="span" sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              animation: 'startup-flight 2s linear infinite',
              '@keyframes startup-flight': {
                from: { transform: 'translateX(-60%)' },
                to: { transform: 'translateX(60%)' },
              },
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
                transform: 'none',
              },
            }}>
              <FlightRoundedIcon sx={{
                fontSize: LOADING_INDICATOR_SIZE,
                transform: 'rotate(90deg)',
                bgcolor: 'background.paper',
              }} />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AppStartupScreen;
