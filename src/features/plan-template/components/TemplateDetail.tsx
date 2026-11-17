'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppErrorState from '@/base/components/ui/AppErrorState';
import { Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { AppPageContainer, AppButton, AppBackHeader } from '@/base/components/ui';
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
  const router = useRouter();
  const t = useTranslations('planTemplate');
  const [copyOpen, setCopyOpen] = useState(false);
  return (
    <AppPageContainer>
      <Stack spacing={2} sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        <AppBackHeader title={t('backToLibrary')} backHref="/templates" backLabel={t('backToLibrary')} headingComponent="h2" />
        {!detail ? (
          <AppErrorState
            variant={status === 404 ? 'notFound' : status === 403 ? 'forbidden' : 'load'}
            onRetry={() => router.refresh()}
          />
        ) : (
          <TemplateSaveProvider key={detail.template.id} ids={[detail.template.id]}>
            {detail.template.coverUrl && <TemplateBanner src={detail.template.coverUrl} title={detail.template.title} />}
            <Stack spacing={1} sx={{ minWidth: 0 }}>
              <Typography component="h1" sx={{ fontSize: { xs: '22px', sm: '24px' }, lineHeight: 1.3, fontWeight: 700 }}>
                {detail.template.title}
              </Typography>
              <Typography variant="body2">{detail.template.destination}</Typography>
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                {t('summary', {
                  days: detail.template.durationDays,
                  activities: detail.snapshot.days.reduce((total, day) => total + day.activities.length, 0),
                })}
              </Typography>
              {detail.template.description?.trim() && (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {detail.template.description}
                </Typography>
              )}
              <Stack direction="row" sx={{ flexWrap: 'wrap', alignItems: 'baseline', columnGap: 1, rowGap: 0.5 }}>
                <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{t('cost')}:</Typography>
                <Typography sx={{ fontSize: { xs: '16px', sm: '18px' }, fontWeight: 700, color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>
                  {formatCurrency(detail.template.estimatedCost, detail.template.currency, locale)}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {t('author', {
                  name: detail.template.authorName,
                  count: detail.template.usageCount,
                })}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignSelf: 'flex-start',
                width: { xs: '100%', sm: 'auto' },
                maxWidth: '100%',
                '& > .MuiButton-root': { minHeight: 44, px: 1.5, fontSize: '14px' },
              }}
            >
              <AppButton
                intent="primary"
                size="medium"
                wrapLabel
                onClick={() => setCopyOpen(true)}
                sx={{ flex: { xs: '1 1 0', sm: '0 1 auto' }, minWidth: 0 }}
              >
                {t('use')}
              </AppButton>
              <TemplateSaveButton id={detail.template.id} />
            </Stack>
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
