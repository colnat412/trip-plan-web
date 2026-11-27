'use client';

import { contentColumn } from '@/base/theme/content-layout';
import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppPagination, AppLoadingState, AppEmptyState, AppBackHeader, AppButton } from '@/base/components/ui';
import { useState } from 'react';
import Link from 'next/link';
import { Box, Stack } from '@mui/material';
import Alert from '@/base/components/ui/AppAlert';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { useTranslations } from 'next-intl';

import useMyTemplates from '../hooks/useMyTemplates';
import { useUnpublishPlanTemplate } from '../hooks/usePlanTemplateMutation';
import MyTemplateCard from './MyTemplateCard';
const MyTemplates = () => {
  const t = useTranslations('planTemplate');
  const profile = useTranslations('profile');
  const [page, setPage] = useState(1);
  const query = useMyTemplates({ page });
  const unpublish = useUnpublishPlanTemplate({
    onSuccess: async () => {
      await query.refetch();
    },
  });
  const currentData = query.error ? null : query.listing;
  return (
      <Stack spacing={2} sx={contentColumn}>
        <AppBackHeader
          backHref="/profile"
          backLabel={profile('backToProfile')}
          titleAlign="left"
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, minWidth: 0 }}>
          {currentData?.content.map((item) => (
            <Box key={item.id} sx={{ minWidth: 0, display: 'flex', flex: {
              xs: '0 0 100%', sm: '0 0 calc((100% - 16px) / 2)',
              lg: '0 0 calc((100% - 32px) / 3)', xl: '0 0 calc((100% - 48px) / 4)',
            } }}>
              <MyTemplateCard template={item} isUnpublishing={unpublish.isPending} onUnpublish={unpublish.mutate} />
            </Box>
          ))}
        </Box>
        {(currentData?.totalPages ?? 0) > 1 && (
          <AppPagination
            page={page}
            count={currentData!.totalPages}
            onChange={(_, value) => setPage(value)}
          />
        )}
      </Stack>
  );
};
export default MyTemplates;
