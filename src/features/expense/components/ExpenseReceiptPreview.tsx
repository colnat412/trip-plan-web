'use client';

import { useState } from 'react';
import { Box, Link, Stack, Typography } from '@mui/material';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useTranslations } from 'next-intl';
import { safeHttpUrl } from '@/base/utils';

const ExpenseReceiptPreview = ({ src }: { src: string }) => {
  const t = useTranslations('expense.receipt');
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url = safeHttpUrl(src);
  if (!url) return null;
  return <Stack spacing={1.5}>
    <Typography component="h3" sx={{ fontSize: '14px', fontWeight: 700, color: 'text.primary' }}>
      {t('title')}
    </Typography>
    {failedUrl !== url ? <Box component="img" src={url} alt={t('imageAlt')} loading="lazy"
      referrerPolicy="no-referrer" onError={() => setFailedUrl(url)}
      sx={{ display: 'block', width: '100%', height: 'auto', maxHeight: 420, objectFit: 'contain',
        border: 1, borderColor: 'divider', borderRadius: '12px', bgcolor: 'action.hover' }} /> :
      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{t('previewError')}</Typography>}
    <Link href={url} target="_blank" rel="noopener noreferrer"
      sx={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <OpenInNewRoundedIcon fontSize="small" />
      {t('open')}
    </Link>
  </Stack>;
};

export default ExpenseReceiptPreview;
