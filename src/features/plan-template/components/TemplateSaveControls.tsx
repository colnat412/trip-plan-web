'use client';

import { interactionTransition } from '@/base/theme/interactions';
import type { Theme } from '@mui/material/styles';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { createContext, useContext, type ReactNode } from 'react';
import Link from 'next/link';
import { Box, Stack, IconButton, Tooltip } from '@mui/material';
import Alert from '@/base/components/ui/AppAlert';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useTranslations } from 'next-intl';
import { AppButton } from '@/base/components/ui';
import useTemplateSaves from '../hooks/useTemplateSaves';

const SaveContext = createContext<ReturnType<typeof useTemplateSaves> | null>(null);

function saveHighlight(theme: Theme, saved: boolean) {
  const palette = theme.vars?.palette ?? theme.palette;
  return {
    ...interactionTransition(theme, ['background-color', 'color', 'border-color']),
    backgroundColor: saved ? `color-mix(in srgb, ${palette.error.main} 10%, ${palette.background.paper})` : 'transparent',
    color: saved ? palette.error.main : palette.text.secondary,
    ...theme.applyStyles('dark', { color: saved ? palette.error.light : palette.text.secondary }),
    '&:hover': {
      backgroundColor: `color-mix(in srgb, ${palette.error.main} 14%, ${palette.background.paper})`,
      color: palette.error.main,
      ...theme.applyStyles('dark', { color: palette.error.light }),
    },
    '&:active': { backgroundColor: `color-mix(in srgb, ${palette.error.main} 20%, ${palette.background.paper})`, color: palette.error.main },
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
              ? 'likeLoginRequired'
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
  showCount?: boolean;
  likeCount?: number;
}

export function TemplateSaveButton({
  id,
  iconOnly = false,
  onImage = false,
  compact = false,
  showCount = false,
  likeCount,
}: TemplateSaveButtonProps) {
  const state = useContext(SaveContext);
  const t = useTranslations('planTemplate');
  if (!state) return null;
  const saved = state.savedIds.includes(id);
  const count = state.getLikeCount(id, likeCount);
  const hasCount = showCount && typeof count === 'number' && Number.isFinite(count) && count >= 0;
  const countLabel = hasCount ? t('likesCount', { count }) : '';
  const heart = <Box component="span" className="template-save-icon">
    {saved ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
    {hasCount && <Box component="span" sx={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: onImage ? 'common.white' : 'text.secondary' }}>{count}</Box>}
  </Box>;
  const iconButtonSx = (theme: Theme) => ({
    width: hasCount ? 'auto' : 44,
    minWidth: 44,
    height: 44,
    p: 0.75,
    borderRadius: 'var(--app-radius-control)',
    '&:hover, &:active': { backgroundColor: 'transparent' },
    '&.Mui-focusVisible': { outline: '2px solid', outlineColor: onImage ? 'common.white' : 'primary.main', outlineOffset: 2 },
    '& .template-save-icon': {
      ...interactionTransition(theme, ['color']),
      backgroundColor: 'transparent',
      color: saved ? (theme.vars?.palette ?? theme.palette).error.main : onImage ? 'common.white' : (theme.vars?.palette ?? theme.palette).text.secondary,
      filter: onImage ? 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.65))' : 'none',
      width: hasCount ? 'auto' : compact ? 28 : 32,
      minWidth: compact ? 28 : 32,
      gap: 0.5,
      px: hasCount ? 0.75 : 0,
      height: compact ? 28 : 32,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--app-radius-small)',
      '& .MuiSvgIcon-root': { fontSize: compact ? 17 : 20 },
    },
    '&:hover .template-save-icon, &:active .template-save-icon': {
      backgroundColor: 'transparent',
      color: saved ? (theme.vars?.palette ?? theme.palette).error.main : onImage ? 'common.white' : (theme.vars?.palette ?? theme.palette).text.secondary,
    },
    '&.Mui-disabled .template-save-icon': {
      color: saved ? (theme.vars?.palette ?? theme.palette).error.main : onImage ? 'common.white' : (theme.vars?.palette ?? theme.palette).text.secondary,
      opacity: 0.5,
      backgroundColor: 'transparent',
    },
  });
  const labelButtonSx = (theme: Theme) => ({
    ...saveHighlight(theme, saved),
    minHeight: 44,
    px: 1.5,
    fontSize: '14px',
    border: '1px solid',
    borderColor: saved ? 'error.main' : 'divider',
    '& .MuiButton-startIcon > :nth-of-type(1)': { fontSize: 20 },
    '& .MuiSvgIcon-root': { color: saved ? (theme.vars?.palette ?? theme.palette).error.main : (theme.vars?.palette ?? theme.palette).text.secondary },
    '&.Mui-disabled .MuiSvgIcon-root': { opacity: 0.5 },
    '&.Mui-disabled': { color: 'text.disabled', backgroundColor: 'action.disabledBackground', borderColor: 'divider' },
  });
  if (iconOnly) {
    const label = `${t(saved ? 'unsave' : 'save')}${hasCount ? ` · ${countLabel}` : ''}`;
    return (
      <Tooltip title={label}>
        <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>
          {state.isGuest ? (
            <IconButton
              disableRipple
              component={Link}
              href={`/login?returnTo=${encodeURIComponent(`/templates/${id}`)}`}
              aria-label={label}
              sx={iconButtonSx}
            >
              {heart}
            </IconButton>
          ) : (
            <IconButton
              disableRipple
              disabled={!state.ready || state.pending}
              aria-label={label}
              aria-pressed={saved}
              sx={iconButtonSx}
              onClick={() => void state.toggle(id, likeCount)}
            >
              {heart}
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
        startIcon={<FavoriteBorderRoundedIcon />}
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
      startIcon={saved ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
      onClick={() => void state.toggle(id, likeCount)}
    >
      {t(saved ? 'unsave' : 'save')}
    </AppButton>
  );
}
