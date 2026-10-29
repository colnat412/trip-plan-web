'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton, AppEmptyState } from '@/base/components/ui';
import useTemplateLibrary from '../hooks/useTemplateLibrary';
import type { TemplateListing } from '../types';
import TemplateFilters from './TemplateFilters';
import TemplateCard from './TemplateCard';
import TemplateSection from './TemplateSection';
import { TemplateSaveProvider } from './TemplateSaveControls';
const TemplateLibrary = ({
  initialData,
  compact = false,
  savedOnly = false,
}: {
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
  const size = compact ? 3 : 12;
  const query = useTemplateLibrary({
    savedOnly,
    search,
    duration,
    tag,
    sort,
    page,
    size,
    initialData,
  });
  const data = query.listing;
  const content = (
    <Stack spacing={2} sx={{ width: '100%', minWidth: 0 }}>
      <Stack
        direction="row"
        useFlexGap
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          minWidth: 0,
        }}
      >
        <Typography
          component={compact ? 'h2' : 'h1'}
          sx={{
            fontSize: compact
              ? { xs: '18px', sm: '20px' }
              : { xs: '24px', sm: '28px' },
            fontWeight: 700,
            minWidth: 0,
            overflowWrap: 'anywhere',
            flex: '1 1 180px',
          }}
        >
          {t(savedOnly ? 'savedLibrary' : 'library')}
        </Typography>
        {compact && (
          <AppButton
            component={Link}
            href="/templates"
            intent="text"
            size="small"
            wrapLabel
          >
            {t('all')}
          </AppButton>
        )}
      </Stack>
      {!compact && !savedOnly && (
        <TemplateFilters
          search={search}
          duration={duration}
          tag={tag}
          sort={sort}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onDuration={(value) => {
            setDuration(value);
            setPage(1);
          }}
          onTag={(value) => {
            setTag(value);
            setPage(1);
          }}
          onSort={(value) => {
            setSort(value);
            setPage(1);
          }}
        />
      )}
      {query.error && (
        <Alert
          severity="error"
          action={
            <AppButton
              onClick={() => void query.refetch().catch(() => undefined)}
            >
              {t('retry')}
            </AppButton>
          }
        >
          {t('loadError')}
        </Alert>
      )}
      {!data && !query.error && <Skeleton variant="rounded" height={240} />}
      {data && !data.content.length && (
        <AppEmptyState
          title={t(savedOnly ? 'savedEmpty'
            : search || duration || tag ? 'noResults' : 'empty')}
          action={savedOnly ? (
            <AppButton component={Link} href="/templates" intent="secondary" size="small">
              {t('navExplore')}
            </AppButton>
          ) : undefined}
        />
      )}
      <TemplateSaveProvider key={data?.content.map((item) => item.id).join(',') ?? ''}
        ids={data?.content.map((item) => item.id) ?? []}
        onChange={savedOnly ? () => {
          if (data?.content.length === 1 && page > 1) setPage(page - 1);
          else void query.refetch().catch(() => undefined);
        } : undefined}>
        <Box
          role={compact ? 'region' : undefined}
          aria-label={compact ? t('library') : undefined}
          tabIndex={compact ? 0 : undefined}
          sx={{
            display: 'flex',
            flexWrap: compact ? 'nowrap' : 'wrap',
            gap: 2,
            minWidth: 0,
            overflowX: compact ? 'auto' : undefined,
            scrollSnapType: compact ? 'x proximity' : undefined,
            pb: compact ? 0.5 : 0,
          }}
        >
          {data?.content.map((item) => (
            <Box
              key={item.id}
              sx={{
                flex: compact ? '0 0 260px' : { xs: '1 1 100%', sm: '1 1 280px' },
                scrollSnapAlign: compact ? 'start' : undefined,
                minWidth: 0,
                maxWidth: compact ? { xs: '85%', sm: 320 } : { sm: 420 },
              }}
            >
              <TemplateCard template={item} compact={compact} />
            </Box>
          ))}
        </Box>
      </TemplateSaveProvider>
      {!compact && data && data.totalPages > 1 && (
        <Pagination
          page={page}
          count={data.totalPages}
          onChange={(_, value) => setPage(value)}
        />
      )}
    </Stack>
  );
  return compact ? content : (
    <TemplateSection active={savedOnly ? 'saved' : 'explore'}>{content}</TemplateSection>
  );
};
export default TemplateLibrary;
