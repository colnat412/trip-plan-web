'use client';

import { createContext, useContext, type ReactNode } from 'react';
import Link from 'next/link';
import { Alert, Stack, IconButton, Tooltip } from '@mui/material';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import { useTranslations } from 'next-intl';
import { AppButton } from '@/base/components/ui';
import useTemplateSaves from '../hooks/useTemplateSaves';

const SaveContext = createContext<ReturnType<typeof useTemplateSaves> | null>(null);

export function TemplateSaveProvider({
  ids,
  onChange,
  children,
}: {
  ids: string[];
  onChange?: () => void;
  children: ReactNode;
}) {
  const state = useTemplateSaves(ids, onChange);
  const t = useTranslations('planTemplate');
  return (
    <SaveContext.Provider value={state}>
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        {state.statusError && (
          <Alert
            severity="warning"
            action={<AppButton onClick={state.retry}>{t('retry')}</AppButton>}
          >
            {t('saveStatusError')}
          </Alert>
        )}
        {state.error && (
          <Alert
            severity="error"
            action={state.error.status === 401 ? (
              <AppButton
                component={Link}
                href={`/login?returnTo=${encodeURIComponent(`/templates/${state.activeId ?? ''}`)}`}
              >
                {t('login')}
              </AppButton>
            ) : undefined}
          >
            {t(state.error.status === 401
              ? 'loginRequired'
              : state.error.status === 404 ? 'unavailable' : 'saveError')}
          </Alert>
        )}
        {children}
      </Stack>
    </SaveContext.Provider>
  );
}

export function TemplateSaveButton({
  id,
  iconOnly = false,
}: {
  id: string;
  iconOnly?: boolean;
}) {
  const state = useContext(SaveContext);
  const t = useTranslations('planTemplate');
  if (!state) return null;
  const saved = state.savedIds.includes(id);
  if (iconOnly) {
    const label = t(saved ? 'unsave' : 'save');
    return (
      <Tooltip title={label}>
        <span>
          {state.isGuest ? (
            <IconButton
              component={Link}
              href={`/login?returnTo=${encodeURIComponent(`/templates/${id}`)}`}
              aria-label={label}
              color="primary"
              sx={{ width: 44, height: 44 }}
            >
              <BookmarkBorderRoundedIcon />
            </IconButton>
          ) : (
            <IconButton
              disabled={!state.ready || state.pending}
              aria-label={label}
              aria-pressed={saved}
              color="primary"
              sx={{ width: 44, height: 44 }}
              onClick={() => void state.toggle(id)}
            >
              {saved ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
            </IconButton>
          )}
        </span>
      </Tooltip>
    );
  }
  if (state.isGuest) {
    return (
      <AppButton
        component={Link}
        href={`/login?returnTo=${encodeURIComponent(`/templates/${id}`)}`}
        intent="text"
        sx={{ minHeight: 44 }}
        startIcon={<BookmarkBorderRoundedIcon />}
      >
        {t('save')}
      </AppButton>
    );
  }
  return (
    <AppButton
      intent="text"
      disabled={!state.ready || state.pending}
      aria-pressed={saved}
      sx={{ minHeight: 44 }}
      startIcon={saved ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
      onClick={() => void state.toggle(id)}
    >
      {t(saved ? 'unsave' : 'save')}
    </AppButton>
  );
}
