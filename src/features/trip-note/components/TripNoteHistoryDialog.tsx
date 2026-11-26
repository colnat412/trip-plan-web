'use client';

import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton, AppDialog, AppEmptyState, AppErrorState, AppLoadingState } from '@/base/components/ui';
import AppAlert from '@/base/components/ui/AppAlert';
import { useInfiniteQueryGet } from '@/base/hooks';
import { formatDateTime } from '@/base/utils';
import type { TripNoteRevision } from '../types';
import TripNoteImage from './TripNoteImage';

export default function TripNoteHistoryDialog({ tripId, noteId, onClose }: { tripId: string; noteId: string; onClose: () => void }) {
  const t = useTranslations('tripNotes');
  const query = useInfiniteQueryGet<TripNoteRevision>({ queryKey: ['trip-note-history', tripId, noteId],
    endPoint: `/trip/${tripId}/notes/${noteId}/history`, pageSize: 20, getItemKey: revision => revision.id });
  const denied = [401, 403, 404].includes(query.error?.status ?? 0);
  return <AppDialog open onClose={onClose} title={t('history')} maxWidth="sm">
    <Stack spacing={2.5}>
      {query.error && <AppErrorState compact status={query.error.status} onRetry={() => query.refetch()} />}
      {query.isLoading ? <AppLoadingState local /> : !denied && <>
        {query.items.some(revision => revision.baseline) && <AppAlert severity="info">{t('baselineNotice')}</AppAlert>}
        {query.items.length === 0 && !query.error && <AppEmptyState title={t('historyEmpty')} />}
        {query.items.map(revision => <Stack key={revision.id} spacing={1} sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{t(revision.baseline ? 'baselineVersion' : revision.noteVersion === 0 ? 'originalVersion' : 'editedVersion', { version: revision.noteVersion })}</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{revision.editorName || t('member')} · {formatDateTime(revision.createdAt)}</Typography>
          {revision.content && <Typography sx={{ fontSize: 14, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{revision.content}</Typography>}
          <TripNoteImage src={revision.imageUrl} />
        </Stack>)}
        {query.hasNextPage && <AppButton intent="secondary" loading={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>{t('olderVersions')}</AppButton>}
      </>}
    </Stack>
  </AppDialog>;
}
