'use client';

import { contentColumn } from '@/base/theme/content-layout';
import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppPagination, AppLoadingState, AppButton, AppEmptyState, AppPageHeader, AppBackHeader, AppSectionHeader, AppSectionLink } from '@/base/components/ui';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import useTemplateLibrary from '../hooks/useTemplateLibrary';
import type { TemplateListing } from '../types';
import TemplateFilters from './TemplateFilters';
import TemplateCard from './TemplateCard';
import TemplateLibraryCard from './TemplateLibraryCard';
import { TemplateSaveProvider } from './TemplateSaveControls';

interface TemplateLibraryProps {
  initialData?: TemplateListing | null;
  compact?: boolean;
  savedOnly?: boolean;
}

const TemplateLibrary = ({ initialData, compact = false, savedOnly = false }: TemplateLibraryProps) => {
  const t = useTranslations('planTemplate');
  const profile = useTranslations('profile');
  const [search, setSearch] = useState('');
  const [duration, setDuration] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const query = useTemplateLibrary({
    savedOnly, search, duration, tag, sort, page, size: compact ? 6 : 12, initialData,
  });
  const data = query.error ? null : query.listing;
  const content = (
    <Stack component={compact ? 'section' : 'div'} useFlexGap spacing={2} sx={{ ...(!compact ? contentColumn : {}), width: '100%', minWidth: 0 }}>
      {compact ? (
        <AppSectionHeader title={t('homeLibrary')} actions={
          <AppSectionLink href="/templates">
            {t('all')}
          </AppSectionLink>
        } />
      ) : (
        savedOnly ? <AppBackHeader title={t('savedLibrary')} backHref="/profile" backLabel={profile('backToProfile')} titleAlign="left" />
          : <AppPageHeader title={t('library')} />
      )}
      {!compact && !savedOnly && (
        <TemplateFilters
          search={search} duration={duration} tag={tag} sort={sort}
          onSearch={(value) => { setSearch(value); setPage(1); }}
          onDuration={(value) => { setDuration(value); setPage(1); }}
          onTag={(value) => { setTag(value); setPage(1); }}
          onSort={(value) => { setSort(value); setPage(1); }}
        />
      )}
      {query.error && (
        <AppErrorState status={query.error.status} onRetry={() => query.refetch()} compact />
      )}
      {!data && !query.error && <AppLoadingState />}
      {data && !data.content.length && (
        <AppEmptyState
          title={t(savedOnly ? 'savedEmpty' : search || duration || tag ? 'noResults' : 'empty')}
          action={savedOnly ? (
            <AppButton component={Link} href="/templates" intent="secondary" size="medium">
              {t('navExplore')}
            </AppButton>
          ) : search || duration || tag ? (
            <AppButton intent="secondary" size="medium" wrapLabel onClick={() => {
              setSearch(''); setDuration(''); setTag(''); setSort('recent'); setPage(1);
            }}>{t('resetSearch')}</AppButton>
          ) : undefined}
        />
      )}
      {!!data?.content.length && <TemplateSaveProvider
        key={data?.content.map((item) => item.id).join(',') ?? ''}
        ids={data?.content.map((item) => item.id) ?? []}
        onChange={savedOnly ? () => {
          if (data?.content.length === 1 && page > 1) setPage(page - 1);
          else void query.refetch().catch(() => undefined);
        } : undefined}
      >
        <Box
          role={compact ? 'region' : undefined}
          aria-label={compact ? t('homeLibrary') : undefined}
          tabIndex={compact ? 0 : undefined}
          sx={{
            display: 'flex',
            flexWrap: compact ? 'nowrap' : 'wrap',
            gap: { xs: 1.5, sm: 2 },
            minWidth: 0,
            overflowX: compact ? 'auto' : undefined,
            overscrollBehaviorX: compact ? 'contain' : undefined,
            scrollSnapType: compact ? 'x proximity' : undefined,
            // Chừa chỗ cho viền focus của card đầu/cuối trong vùng cuộn.
            p: compact ? 0.5 : 0,
            scrollPaddingInline: compact ? '4px' : undefined,
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
          }}
        >
          {data?.content.map((item) => (
            <Box key={item.id} sx={{
              flex: compact ? { xs: '0 0 152px', sm: '0 0 192px' } : {
                xs: '0 0 calc((100% - 12px) / 2)', sm: '0 0 calc((100% - 16px) / 2)',
                lg: '0 0 calc((100% - 32px) / 3)', xl: '0 0 calc((100% - 48px) / 4)',
              },
              scrollSnapAlign: compact ? 'start' : undefined,
              minWidth: 0,
              maxWidth: compact ? '75%' : undefined,
            }}>
              {!compact ? <TemplateLibraryCard template={item} /> : <TemplateCard template={item} compact={compact} />}
            </Box>
          ))}
        </Box>
      </TemplateSaveProvider>}
      {!compact && data && data.totalPages > 1 && (
        <AppPagination page={page} count={data.totalPages} onChange={(_, value) => setPage(value)} />
      )}
    </Stack>
  );
  return content;
};
export default TemplateLibrary;
