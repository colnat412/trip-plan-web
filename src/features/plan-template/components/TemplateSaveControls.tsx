'use client';

import { tonalSurface } from '@/base/theme/surfaces';
import { interactionTransition } from '@/base/theme/interactions';
import type { Theme } from '@mui/material/styles';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { createContext, useContext, type ReactNode } from 'react';
import Link from 'next/link';
import { Box, Stack, IconButton, Tooltip } from '@mui/material';
import Alert from '@/base/components/ui/AppAlert';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import { useTranslations } from 'next-intl';
import { AppButton } from '@/base/components/ui';
import useTemplateSaves from '../hooks/useTemplateSaves';

const SaveContext = createContext<ReturnType<typeof useTemplateSaves> | null>(null);

function saveHighlight(theme: Theme, saved: boolean) {
  const palette = theme.vars?.palette ?? theme.palette;
  return {
    ...interactionTransition(theme, ['background-color', 'color', 'border-color']),
    ...(saved ? tonalSurface(theme, 18) : { backgroundColor: 'transparent' }),
    color: saved ? palette.primary.main : palette.text.secondary,
    '&:hover': {
      ...tonalSurface(theme, saved ? 26 : 12),
      color: palette.primary.main,
    },
    '&:active': { ...tonalSurface(theme, 32), color: palette.primary.main },
    '@media (forced-colors: active)': {
      backgroundColor: saved ? 'Highlight' : 'Canvas',
      color: saved ? 'HighlightText' : 'CanvasText',
      '&:hover, &:active': { backgroundColor: 'Highlight', color: 'HighlightText' },
    },
  };
}

interface TemplateSaveProviderProps {
  ids: string[];
  onChange?: () => void;
  children: ReactNode;
}

export function TemplateSaveProvider({
  ids,
  onChange,
  children,
}: TemplateSaveProviderProps) {
  const state = useTemplateSaves(ids, onChange);
  const t = useTranslations('planTemplate');
  return (
    <SaveContext.Provider value={state}>
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        {state.statusError && (
          <AppErrorState status={state.statusError.status} onRetry={state.retry} compact />
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

interface TemplateSaveButtonProps {
  id: string;
  iconOnly?: boolean;
  onImage?: boolean;
  compact?: boolean;
}

export function TemplateSaveButton({
  id,
  iconOnly = false,
  onImage = false,
  compact = false,
}: TemplateSaveButtonProps) {
  const state = useContext(SaveContext);
  const t = useTranslations('planTemplate');
  if (!state) return null;
  const saved = state.savedIds.includes(id);
  const iconButtonSx = (theme: Theme) => ({
    width: 44,
    height: 44,
    p: 0.75,
    borderRadius: 'var(--app-radius-control)',
    '&:hover, &:active': { backgroundColor: 'transparent' },
    '&.Mui-focusVisible': { outline: '2px solid', outlineColor: onImage ? 'common.white' : 'primary.main', outlineOffset: 2 },
    '& .template-save-icon': {
      ...saveHighlight(theme, saved),
      width: compact ? 28 : 32,
      height: compact ? 28 : 32,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--app-radius-small)',
      ...(!saved && {
        backgroundColor: onImage ? 'rgba(0, 0, 0, 0.56)' : 'background.paper',
        color: onImage ? 'common.white' : 'text.secondary',
      }),
      '& .MuiSvgIcon-root': { fontSize: compact ? 17 : 20 },
    },
    '&:hover .template-save-icon': saveHighlight(theme, saved)['&:hover'],
    '&:active .template-save-icon': saveHighlight(theme, saved)['&:active'],
    '&.Mui-disabled .template-save-icon': {
      color: onImage ? 'rgba(255, 255, 255, 0.5)' : 'text.disabled',
      backgroundColor: onImage ? 'rgba(0, 0, 0, 0.56)' : 'action.disabledBackground',
    },
  });
  const labelButtonSx = (theme: Theme) => ({
    ...saveHighlight(theme, saved),
    minHeight: 44,
    px: 1.5,
    fontSize: '14px',
    border: '1px solid',
    borderColor: saved ? tonalSurface(theme, 18).borderColor : 'divider',
    '& .MuiButton-startIcon > :nth-of-type(1)': { fontSize: 20 },
    '&.Mui-disabled': { color: 'text.disabled', backgroundColor: 'action.disabledBackground', borderColor: 'divider' },
  });
  if (iconOnly) {
    const label = t(saved ? 'unsave' : 'save');
    return (
      <Tooltip title={label}>
        <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>
          {state.isGuest ? (
            <IconButton
              component={Link}
              href={`/login?returnTo=${encodeURIComponent(`/templates/${id}`)}`}
              aria-label={label}
              sx={iconButtonSx}
            >
              <Box component="span" className="template-save-icon"><BookmarkBorderRoundedIcon /></Box>
            </IconButton>
          ) : (
            <IconButton
              disabled={!state.ready || state.pending}
              aria-label={label}
              aria-pressed={saved}
              sx={iconButtonSx}
              onClick={() => void state.toggle(id)}
            >
              <Box component="span" className="template-save-icon">
                {saved ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
              </Box>
            </IconButton>
          )}
        </Box>
      </Tooltip>
    );
  }
  if (state.isGuest) {
    return (
      <AppButton
        component={Link}
        href={`/login?returnTo=${encodeURIComponent(`/templates/${id}`)}`}
        intent="text"
        size="medium"
        wrapLabel
        sx={labelButtonSx}
        startIcon={<BookmarkBorderRoundedIcon />}
      >
        {t('save')}
      </AppButton>
    );
  }
  return (
    <AppButton
      intent="text"
      size="medium"
      wrapLabel
      disabled={!state.ready || state.pending}
      aria-pressed={saved}
      sx={labelButtonSx}
      startIcon={saved ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
      onClick={() => void state.toggle(id)}
    >
      {t(saved ? 'unsave' : 'save')}
    </AppButton>
  );
}
