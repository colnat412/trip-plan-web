'use client';

import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton, AppDialog, AppEmptyState, AppErrorState, AppLoadingState } from '@/base/components/ui';
import useTripNoteHistory from '../hooks/useTripNoteHistory';
import { formatDateTime } from '@/base/utils';
import TripNoteImage from './TripNoteImage';

interface TripNoteHistoryDialogProps { tripId: string; noteId: string; onClose: () => void }

export default function TripNoteHistoryDialog({ tripId, noteId, onClose }: TripNoteHistoryDialogProps) {
  const t = useTranslations('tripNotes');
  const query = useTripNoteHistory({ tripId, noteId });
  const revisions = [...query.items].sort((a, b) => b.noteVersion - a.noteVersion || b.createdAt.localeCompare(a.createdAt));
  const denied = [401, 403, 404].includes(query.error?.status ?? 0);
  return <AppDialog open onClose={onClose} title={t('history')} maxWidth="sm">
    <Stack spacing={1.5}>
      {query.error && <AppErrorState compact status={query.error.status} onRetry={() => query.refetch()} />}
      {query.isLoading ? <AppLoadingState local /> : !denied && <>
        {query.items.length === 0 && !query.error && <AppEmptyState title={t('historyEmpty')} />}
        {revisions.map(revision => <Stack key={revision.id} spacing={0.75} sx={{ pb: 1.5, '&:last-child': { borderBottom: 0, pb: 0 }, borderBottom: 1, borderColor: 'divider' }}>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{revision.editorName || t('member')} · {formatDateTime(revision.createdAt)}</Typography>
          {revision.content && <Typography sx={{ fontSize: 14, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{revision.content}</Typography>}
          <TripNoteImage src={revision.imageUrl} />
        </Stack>)}
        {query.hasNextPage && <AppButton intent="secondary" loading={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>{t('olderVersions')}</AppButton>}
      </>}
    </Stack>
  </AppDialog>;
}
