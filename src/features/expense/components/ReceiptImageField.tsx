'use client';

import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppImageUploader } from '@/base/components/ui';

const ReceiptImageField = ({ src, file, disabled, onChange }: {
  src?: string | null;
  file?: File | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}) => {
  const t = useTranslations('expense.receipt');
  return <Stack spacing={1}>
    <Typography component="h3" sx={{ fontSize: '14px', fontWeight: 700, color: 'text.primary' }}>
      {t('label')}
    </Typography>
    <AppImageUploader src={src} file={file} alt={t('imageAlt')} variant="receipt" compact disabled={disabled}
      onChange={onChange} />
  </Stack>;
};

export default ReceiptImageField;
