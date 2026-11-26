'use client';

import { useState } from 'react';
import { Box, Link, Stack, Typography } from '@mui/material';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { useTranslations } from 'next-intl';
import { safeHttpUrl } from '@/base/utils';

interface ExpenseReceiptPreviewProps { src: string }

const ExpenseReceiptPreview = ({ src }: ExpenseReceiptPreviewProps) => {
  const t = useTranslations('expense.receipt');
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url = safeHttpUrl(src);
  if (!url) return null;
  return <Stack spacing={1} sx={{ minWidth: 0 }}>
    <Typography component="h3" sx={{ fontSize: '14px', fontWeight: 700, color: 'text.primary' }}>
      {t('title')}
    </Typography>
    <Link href={url} target="_blank" rel="noopener noreferrer" aria-label={t('open')} underline="none"
      sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%',
        border: 1, borderColor: 'divider', borderRadius: 'var(--app-radius-control)', overflow: 'hidden',
        bgcolor: 'background.paper', color: 'text.primary',
        '&:hover': { borderColor: 'primary.main' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
      {failedUrl !== url ? <Box component="img" src={url} alt={t('imageAlt')} loading="lazy"
        referrerPolicy="no-referrer" onError={() => setFailedUrl(url)}
        sx={{ display: 'block', width: '100%', aspectRatio: '16 / 9', maxHeight: 192, objectFit: 'cover', bgcolor: 'action.hover' }} /> :
        <Stack spacing={1} sx={{ minHeight: 112, p: 1.5, alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
          <ImageOutlinedIcon color="action" />
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{t('previewError')}</Typography>
        </Stack>}
      <Stack direction="row" sx={{ minHeight: 44, px: 1.5, alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography component="span" sx={{ fontSize: '13px', fontWeight: 600 }}>{t('open')}</Typography>
        <OpenInNewRoundedIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
      </Stack>
    </Link>
  </Stack>;
};

export default ExpenseReceiptPreview;
