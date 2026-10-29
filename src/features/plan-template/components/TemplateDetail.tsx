'use client';
import { useState } from 'react';
import Link from 'next/link';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Alert, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { AppPageContainer, AppButton } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { TemplateDetailData } from '../types';
import TemplateBanner from './TemplateBanner';
import TemplateItinerary from './TemplateItinerary';
import CopyTemplateDialog from './CopyTemplateDialog';
import { TemplateSaveProvider, TemplateSaveButton } from './TemplateSaveControls';
const TemplateDetail = ({
  detail,
  status,
}: {
  detail: TemplateDetailData | null;
  status: number;
}) => {
  const locale = useLocale();
  const t = useTranslations('planTemplate');
  const [copyOpen, setCopyOpen] = useState(false);
  return (
    <AppPageContainer>
      <Stack spacing={2} sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        <AppButton
          component={Link}
          href="/templates"
          intent="text"
          startIcon={<ArrowBackRoundedIcon />}
          wrapLabel
          sx={{
            alignSelf: 'flex-start',
            justifyContent: 'flex-start',
            minHeight: 44,
            maxWidth: '100%',
          }}
        >
          {t('backToLibrary')}
        </AppButton>
        {!detail ? (
          <Alert severity="warning">
            {t(status === 404 ? 'unavailable' : 'loadError')}
          </Alert>
        ) : (
          <TemplateSaveProvider key={detail.template.id} ids={[detail.template.id]}>
            {detail.template.coverUrl && <TemplateBanner src={detail.template.coverUrl} title={detail.template.title} />}
            <Typography component="h1" sx={{ fontSize: 26, fontWeight: 700 }}>
              {detail.template.title}
            </Typography>
            <Typography>{detail.template.destination}</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {detail.template.description}
            </Typography>
            <Typography>
              {t('cost')}:{' '}
              {formatCurrency(
                detail.template.estimatedCost,
                detail.template.currency,
                locale,
              )}
            </Typography>
            <Typography variant="body2">
              {t('author', {
                name: detail.template.authorName,
                count: detail.template.usageCount,
              })}
            </Typography>
            <AppButton intent="primary" onClick={() => setCopyOpen(true)}>
              {t('use')}
            </AppButton>
            <TemplateSaveButton id={detail.template.id} />
            <TemplateItinerary
              snapshot={detail.snapshot}
              currency={detail.template.currency}
            />
            <CopyTemplateDialog
              key={`${detail.template.id}:${detail.template.contentVersion}`}
              template={detail.template}
              open={copyOpen}
              onClose={() => setCopyOpen(false)}
            />
          </TemplateSaveProvider>
        )}
      </Stack>
    </AppPageContainer>
  );
};
export default TemplateDetail;
