'use client';

import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTranslations } from 'next-intl';

/** A dismissible layout hint for larger screens; it never blocks the app. */
export default function AppDeviceHint() {
  const t = useTranslations('deviceExperience');
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <Box role="note" sx={{
      display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, flexShrink: 0,
      px: { md: 3, xl: 4 }, bgcolor: 'action.hover', color: 'text.secondary',
      borderBottom: 1, borderColor: 'divider', minWidth: 0,
    }}>
      <SmartphoneRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
      <Typography sx={{ flex: 1, minWidth: 0, fontSize: '12px', lineHeight: 1.5 }}>{t('message')}</Typography>
      <IconButton size="small" aria-label={t('dismiss')} onClick={() => setDismissed(true)}
        sx={{ width: 44, height: 44, flexShrink: 0, color: 'text.secondary' }}>
        <CloseRoundedIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}
