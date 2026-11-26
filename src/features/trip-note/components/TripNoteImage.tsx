'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function TripNoteImage({ src, onLoad }: { src?: string | null; onLoad?: () => void }) {
  const t = useTranslations('tripNotes');
  if (!src) return null;
  return <Box component="a" href={src} target="_blank" rel="noopener noreferrer" aria-label={t('openImage')}
    sx={{ display: 'block', width: 280, maxWidth: '100%', borderRadius: 'var(--app-radius-small)', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
    <Box component="img" draggable={false} src={src} alt={t('image')} onLoad={onLoad}
      sx={{ display: 'block', width: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 'inherit' }} />
  </Box>;
}
