'use client';

import { Box, Link } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function DestinationPhotoCredits() {
  const t = useTranslations('journey');
  return <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
    <Link href="/destinations/credits.html" target="_blank" rel="noopener noreferrer" onMouseDown={event => event.preventDefault()}
      sx={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontSize: 12, color: 'text.secondary' }}>
      {t('photoCredits')}
    </Link>
  </Box>;
}
