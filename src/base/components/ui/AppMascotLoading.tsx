'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import AppMascot from './AppMascot';

interface AppMascotLoadingProps { message?: string }

export default function AppMascotLoading({ message }: AppMascotLoadingProps) {
  const t = useTranslations('loading');
  return <Box role="status" aria-label={message ?? t('label')} sx={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    animation: 'mascot-loading-pulse 1600ms ease-in-out infinite alternate',
    '@keyframes mascot-loading-pulse': { from: { opacity: 0.65 }, to: { opacity: 1 } },
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  }}><AppMascot mood="loading" size={112} /></Box>;
}
