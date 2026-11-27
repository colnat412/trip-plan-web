'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { useTranslations } from 'next-intl';
import useLongPress from '@/base/hooks/use-long-press';
import { ApiError } from '@/base/api';
import { AppActionMenu, AppButton, AppConfirmDialog, AppDialog, AppEmptyState,
  AppErrorState, AppLoadingState, AppPageContainer, AppPageHeader, AppToast, type AppActionMenuItem } from '@/base/components/ui';
import { formatDate, getUserInitials } from '@/base/utils';
import { useTripContext } from '@/features/trip/context/TripContext';
import useTripNotes from '../hooks/useTripNotes';
import type { TripNote } from '../types';
import TripNoteForm from './TripNoteForm';
import TripNoteImage from './TripNoteImage';
import TripNoteHistoryDialog from './TripNoteHistoryDialog';

interface TripNotesPanelProps { tripId: string }

function TripNotesPanel({ tripId }: TripNotesPanelProps) {
  const t = useTranslations('tripNotes');
  const query = useTripNotes(tripId);
  const [actionTarget, setActionTarget] = useState<{ noteId: string; element: HTMLElement } | null>(null);
  const press = useLongPress(element => {
    const noteId = element.dataset.noteId;
    if (noteId) setActionTarget({ noteId, element });
  });
  const [editing, setEditing] = useState<TripNote | null>(null);
  const [deleting, setDeleting] = useState<TripNote | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [editError, setEditError] = useState('');
  const [editingSaving, setEditingSaving] = useState(false);
  const [failure, setFailure] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const [lastSeenId, setLastSeenId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const followLatest = useRef(true);
  const loaded = useRef(false);
  const olderPosition = useRef<{ height: number; top: number } | null>(null);
  const newestId = query.items[0]?.id ?? null;
  const orderedNotes = [...query.items].reverse();
  const scrollToLatest = () => {
    followLatest.current = true;
    setAtBottom(true);
    setLastSeenId(newestId);
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  };
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (olderPosition.current) {
      if (query.isFetchingNextPage) return;
      list.scrollTop = olderPosition.current.top + list.scrollHeight - olderPosition.current.height;
      olderPosition.current = null;
    } else if (followLatest.current || !loaded.current) {
      list.scrollTop = list.scrollHeight;
      loaded.current = true;
    }
  }, [query.items, query.isFetchingNextPage]);

  const accessDenied = [401, 403, 404].includes(query.error?.status ?? 0);
  if (accessDenied) return <AppPageContainer embedded><AppErrorState status={query.error?.status} onRetry={() => query.refetch()} /></AppPageContainer>;
  const selectedNote = actionTarget ? query.items.find(note => note.id === actionTarget.noteId) : undefined;
  const actions = (note: TripNote): AppActionMenuItem[] => [
    { id: 'history', label: t('history'), icon: <HistoryRoundedIcon fontSize="small" />, onClick: () => setHistoryId(note.id) },
    ...(note.canEdit ? [{ id: 'edit', label: t('edit'), icon: <EditRoundedIcon fontSize="small" />,
      onClick: () => { setEditError(''); setEditing(note); }, disabled: query.busy }] : []),
    ...(note.canDelete ? [{ id: 'delete', label: t('delete'), icon: <DeleteOutlineRoundedIcon fontSize="small" />,
      onClick: () => setDeleting(note), danger: true, disabled: query.busy }] : []),
  ];

  return <AppPageContainer embedded sx={{ flex: '1 1 0', overflow: 'hidden', gap: 1.5 }}>
    <Box sx={{ flexShrink: 0 }}><AppPageHeader title={t('title')} /></Box>
    {query.error && <AppErrorState status={query.error.status} onRetry={() => query.refetch()} compact />}
    <Box ref={listRef} role="log" aria-label={t('listLabel')} aria-live="polite" aria-relevant="additions"
      onScroll={() => {
        const list = listRef.current;
        if (!list) return;
        const near = list.scrollHeight - list.scrollTop - list.clientHeight < 64;
        followLatest.current = near;
        setAtBottom(near);
        if (near || atBottom) setLastSeenId(newestId);
      }}
      sx={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', scrollbarGutter: 'stable', py: 1 }}>
      <Stack spacing={1.5}>
        {query.hasNextPage && <AppButton intent="text" disabled={query.busy} loading={query.isFetchingNextPage}
          onClick={() => {
            const list = listRef.current;
            if (list) olderPosition.current = { height: list.scrollHeight, top: list.scrollTop };
            void query.fetchNextPage();
          }}>{t('loadMore')}</AppButton>}
        {query.isLoading && query.items.length === 0 ? <AppLoadingState local />
          : query.items.length === 0 && !query.error ? <AppEmptyState title={t('empty')} />
          : orderedNotes.map((note, index) => {
            const own = note.canEdit;
            const author = note.authorName || t('member');
            const avatar = <Avatar src={note.authorAvatarUrl || undefined} alt={author}
              sx={{ width: 28, height: 28, fontSize: 11, flexShrink: 0 }}>{getUserInitials(author)}</Avatar>;
            const day = note.createdAt?.slice(0, 10);
            const startsDay = day && day !== orderedNotes[index - 1]?.createdAt?.slice(0, 10);
            return <Stack key={note.id} spacing={1.5} sx={{ minWidth: 0 }}>
              {startsDay && <Divider sx={{ color: 'text.secondary', fontSize: 11, my: 0.5 }}>
                <Box component="time" dateTime={day}>{formatDate(day)}</Box>
              </Divider>}
              <Box sx={{ display: 'flex', justifyContent: own ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: 1, minWidth: 0, px: 0.25 }}>
                {!own && avatar}
                <Box {...press} data-note-id={note.id} role="group" tabIndex={0}
                  aria-label={`${t('messageFrom', { name: author })}. ${t('pressHint')}`}
                  sx={{ px: 1.25, py: 1, boxSizing: 'border-box', minWidth: 0, maxWidth: { xs: 'calc(100% - 36px)', sm: '75%' },
                    borderRadius: 'var(--app-radius-card)',
                    borderBottomRightRadius: own ? 'var(--app-radius-detail)' : 'var(--app-radius-card)',
                    borderBottomLeftRadius: own ? 'var(--app-radius-card)' : 'var(--app-radius-detail)',
                    bgcolor: own ? 'primary.main' : 'background.paper', color: own ? 'primary.contrastText' : 'text.primary',
                    border: 1, borderColor: own ? 'primary.main' : 'divider',
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.light', outlineOffset: 2 },
                    '@media (pointer: coarse)': { userSelect: 'none', WebkitTouchCallout: 'none' } }}>
                  <Stack spacing={0.75}>
                    {!own && <Typography sx={{ fontSize: 11, fontWeight: 600, overflowWrap: 'anywhere', color: 'text.secondary' }}>{author}</Typography>}
                    {note.content && <Typography sx={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{note.content}</Typography>}
                    <TripNoteImage src={note.imageUrl} onLoad={() => {
                      const list = listRef.current;
                      if (list && followLatest.current) list.scrollTop = list.scrollHeight;
                    }} />
                    <Typography sx={{ alignSelf: 'flex-end', fontSize: 10, lineHeight: 1.3, color: own ? 'inherit' : 'text.secondary', opacity: own ? 0.85 : 1 }}>
                      {note.version > 0 && `${t('edited')} · `}<Box component="time" dateTime={note.createdAt}>{note.createdAt?.slice(11, 16)}</Box>
                    </Typography>
                  </Stack>
                </Box>
                {own && avatar}
              </Box>
            </Stack>;
          })}
      </Stack>
    </Box>
    {!atBottom && newestId !== lastSeenId && <AppButton intent="secondary" size="small" onClick={scrollToLatest} sx={{ alignSelf: 'center', flexShrink: 0 }}>{t('newMessages')}</AppButton>}
    <Box sx={{ flexShrink: 0, borderTop: 1, borderColor: 'divider', pt: 1 }}>
      <TripNoteForm busy={query.busy} onSubmit={async draft => {
        try { await query.create.mutateAsync(draft); }
        catch (error) { setFailure(true); throw error; }
        followLatest.current = true;
        setAtBottom(true);
        await query.refetch();
      }} />
    </Box>
    <AppActionMenu hideTrigger ariaLabel={t('actions')}
      anchorEl={selectedNote ? actionTarget?.element ?? null : null}
      onClose={() => setActionTarget(null)}
      items={selectedNote ? actions(selectedNote) : []} />
    {editing && <AppDialog open onClose={() => setEditing(null)} title={t('edit')} protectChanges closeDisabled={query.busy || editingSaving} maxWidth="xs">
      <Stack spacing={1.5}>
        {editError && <Typography role="alert" color="error" sx={{ fontSize: 13 }}>{editError}</Typography>}
        <TripNoteForm key={editing.id} initialContent={editing.content} initialImageUrl={editing.imageUrl} editing busy={query.busy} onSavingChange={setEditingSaving} onSubmit={async draft => {
          setEditError('');
          try {
            await query.update.mutateAsync({ noteId: editing.id, ...draft, version: editing.version });
            setEditing(null);
            await query.refetch();
          } catch (error) {
            setEditError(t(error instanceof ApiError && error.status === 409 ? 'conflict' : 'error'));
            void query.refetch();
            throw error;
          }
        }} />
      </Stack>
    </AppDialog>}
    {historyId && <TripNoteHistoryDialog key={historyId} tripId={tripId} noteId={historyId} onClose={() => setHistoryId(null)} />}
    {deleting && <AppConfirmDialog open title={t('deleteTitle')} description={t('deleteDescription')}
      confirmText={t('delete')} cancelText={t('cancel')} loading={query.busy} onClose={() => setDeleting(null)} onConfirm={async () => {
        if (query.busy) return;
        try { await query.remove.mutateAsync({ noteId: deleting.id }); setDeleting(null); await query.refetch(); }
        catch { setFailure(true); void query.refetch(); }
      }} />}
    <AppToast open={failure} message={t('error')} severity="error" onClose={() => setFailure(false)} />
  </AppPageContainer>;
}

export default function TripNotes() {
  const t = useTranslations('tripNotes');
  const { activeTrip, isLoading, error, refetchTrips } = useTripContext();
  if (isLoading) return <AppLoadingState />;
  if (error) return <AppErrorState status={error.status} onRetry={() => refetchTrips()} />;
  if (!activeTrip) return <AppEmptyState title={t('noTrip')} />;
  return <TripNotesPanel key={activeTrip.id} tripId={String(activeTrip.id)} />;
}
