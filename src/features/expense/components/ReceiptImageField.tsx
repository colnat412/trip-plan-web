'use client';

import { Stack, Typography } from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useTranslations } from 'next-intl';
import { AppImageUploader } from '@/base/components/ui';

const ReceiptImageField = ({ src, disabled, onChange }: {
  src?: string | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}) => {
  const t = useTranslations('expense.receipt');
  return <Stack spacing={1}>
    <Typography component="h3" sx={{ fontSize: '14px', fontWeight: 700, color: 'text.primary' }}>
      {t('label')}
    </Typography>
    <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{t('description')}</Typography>
    <AppImageUploader src={src} alt={t('imageAlt')} variant="receipt" disabled={disabled}
      fallback={<ReceiptLongRoundedIcon sx={{ fontSize: '40px' }} />} onChange={onChange} />
  </Stack>;
};

export default ReceiptImageField;
