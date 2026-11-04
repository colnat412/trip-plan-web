'use client';

import Image from 'next/image';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';

const AppStartupScreen = () => {
  const t = useTranslations('loading');

  return (
    <Box
      role="status"
      aria-label={t('label')}
      sx={(theme) => ({
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.modal + 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        p: 3,
      })}
    >
      <Image src="/icon.svg" alt="" width={88} height={88} priority />
    </Box>
  );
};

export default AppStartupScreen;
