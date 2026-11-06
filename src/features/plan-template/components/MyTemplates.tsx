'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppLoadingState, AppEmptyState, AppPageHeader, AppButton } from '@/base/components/ui';
import { useState } from 'react';
import Link from 'next/link';
import { Alert, Pagination, Stack } from '@mui/material';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { useTranslations } from 'next-intl';

import useMyTemplates from '../hooks/useMyTemplates';
import { useUnpublishPlanTemplate } from '../hooks/usePlanTemplateMutation';
import MyTemplateCard from './MyTemplateCard';
const MyTemplates = () => {
  const t = useTranslations('planTemplate');
  const [page, setPage] = useState(1);
  const query = useMyTemplates({ page });
  const unpublish = useUnpublishPlanTemplate({
    onSuccess: async () => {
      await query.refetch();
    },
  });
  const currentData = query.error ? null : query.listing;
  return (
      <Stack spacing={2}>
        <AppPageHeader
          title={t('mine')}
          actions={
            <AppButton
              component={Link}
              href="/plan"
              intent="primary"
              size="medium"
              startIcon={<PublishRoundedIcon />}
              wrapLabel
            >
              {t('publishNew')}
            </AppButton>
          }
        />
        {query.error && (
          <AppErrorState status={query.error.status} onRetry={() => query.refetch()} compact />
        )}
        {(query.isLoading || (query.isStale && !query.error)) && <AppLoadingState />}
        {currentData?.content.length === 0 && (
          <AppEmptyState title={t('emptyMine')} />
        )}
        {unpublish.error && (
          <Alert severity="error" onClose={unpublish.clearError}>
            {t('unpublishError')}
          </Alert>
        )}
        {currentData?.content.map((item) => (
          <MyTemplateCard
            key={item.id}
            template={item}
            isUnpublishing={unpublish.isPending}
            onUnpublish={unpublish.mutate}
          />
        ))}
        {(currentData?.totalPages ?? 0) > 1 && (
          <Pagination
            page={page}
            count={currentData!.totalPages}
            onChange={(_, value) => setPage(value)}
          />
        )}
      </Stack>
  );
};
export default MyTemplates;
