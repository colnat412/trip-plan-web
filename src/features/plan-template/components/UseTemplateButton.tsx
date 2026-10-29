'use client';

import Link from 'next/link';
import { Tooltip } from '@mui/material';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import { useTranslations } from 'next-intl';
import { AppButton } from '@/base/components/ui';

export default function UseTemplateButton() {
  const t = useTranslations('planTemplate');
  return (
    <Tooltip title={t('chooseTemplateHint')}>
      <AppButton
        component={Link}
        href="/templates"
        intent="secondary"
        size="medium"
        startIcon={<CollectionsBookmarkOutlinedIcon />}
        aria-label={`${t('chooseTemplate')}. ${t('chooseTemplateHint')}`}
        sx={{ minHeight: 44 }}
        wrapLabel
      >
        {t('chooseTemplate')}
      </AppButton>
    </Tooltip>
  );
}
