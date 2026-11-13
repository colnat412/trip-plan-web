'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import SafariInstallIllustration from './SafariInstallIllustration';

// Reconstructed Safari panels with localized instructions.
const IOSInstallGuide = () => {
  const t = useTranslations('pwa');
  const steps = ['share', 'home', 'confirm'] as const;

  return (
    <Stack component="ol" spacing={2} sx={{ m: 0, p: 0, listStyle: 'none', minWidth: 0 }}>
      {steps.map((step, index) => (
        <Box component="li" key={step} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', mb: 1 }}>
            <Box aria-hidden="true" sx={{ width: 24, height: 24, flexShrink: 0, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', textAlign: 'center', fontSize: 13, lineHeight: '24px', fontWeight: 700 }}>{index + 1}</Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, overflowWrap: 'anywhere' }}>{t(`guide.${step}.title`)}</Typography>
          </Stack>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 'var(--app-radius-card)', overflow: 'hidden', bgcolor: 'background.paper', color: 'primary.main' }}>
            <SafariInstallIllustration step={step} />
          </Box>
          <Typography sx={{ mt: 0.75, fontSize: 13, color: 'text.secondary', overflowWrap: 'anywhere' }}>{t(`guide.${step}.hint`)}</Typography>
        </Box>
      ))}
      <Typography component="li" sx={{ fontSize: 12, color: 'text.secondary', overflowWrap: 'anywhere' }}>{t('guide.note')}</Typography>
    </Stack>
  );
};

export default IOSInstallGuide;
