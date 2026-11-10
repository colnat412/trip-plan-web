'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppLoadingState, AppButton, AppCard, AppEmptyState, AppSectionHeader, AppSectionLink } from '@/base/components/ui';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Pagination, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import useTemplateLibrary from '../hooks/useTemplateLibrary';
import type { TemplateListing } from '../types';
import TemplateFilters from './TemplateFilters';
import TemplateCard from './TemplateCard';
import TemplateSection from './TemplateSection';
import { TemplateSaveProvider } from './TemplateSaveControls';

const TemplateLibrary = ({ initialData, compact = false, savedOnly = false }: {
  initialData?: TemplateListing | null;
  compact?: boolean;
  savedOnly?: boolean;
}) => {
  const t = useTranslations('planTemplate');
  const [search, setSearch] = useState('');
  const [duration, setDuration] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const query = useTemplateLibrary({
    savedOnly, search, duration, tag, sort, page, size: compact ? 3 : 12, initialData,
  });
  const data = query.error ? null : query.listing;
  const content = (
    <Stack spacing={2} sx={{ width: '100%', minWidth: 0 }}>
      {compact ? (
        <AppSectionHeader title={t('homeLibrary')} actions={
          <AppSectionLink href="/templates">
            {t('all')}
          </AppSectionLink>
        } />
      ) : (
        <Typography component="h1" sx={{
          fontSize: { xs: 24, sm: 28 }, fontWeight: 700, overflowWrap: 'anywhere',
        }}>
          {t(savedOnly ? 'savedLibrary' : 'library')}
        </Typography>
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
          ) : undefined}
        />
      )}
      <TemplateSaveProvider
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
            display: compact ? { xs: 'flex', md: 'grid' } : 'grid',
            gridTemplateColumns: compact
              ? { md: `repeat(${Math.min(data?.content.length || 1, 3)}, minmax(0, 1fr))` }
              : { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
            gap: 2,
            minWidth: 0,
            overflowX: compact ? { xs: 'auto', md: 'visible' } : undefined,
            scrollSnapType: compact ? 'x proximity' : undefined,
            // Chừa chỗ cho viền focus của card đầu/cuối trong vùng cuộn.
            p: compact ? 0.5 : 0,
            scrollPaddingInline: compact ? '4px' : undefined,
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
          }}
        >
          {data?.content.map((item) => (
            <Box key={item.id} sx={{
              flex: compact ? '0 0 200px' : undefined,
              scrollSnapAlign: compact ? 'start' : undefined,
              minWidth: 0,
              maxWidth: compact ? { xs: '78%', md: 'none' } : undefined,
            }}>
              <TemplateCard template={item} compact={compact} />
            </Box>
          ))}
        </Box>
      </TemplateSaveProvider>
      {!compact && data && data.totalPages > 1 && (
        <Pagination page={page} count={data.totalPages} onChange={(_, value) => setPage(value)} />
      )}
    </Stack>
  );
  return compact ? (
    <AppCard component="section" sx={{ minWidth: 0, p: { xs: 2, md: 3 }, borderRadius: '20px' }}>
      {content}
    </AppCard>
  ) : <TemplateSection active={savedOnly ? 'saved' : 'explore'}>{content}</TemplateSection>;
};
export default TemplateLibrary;
