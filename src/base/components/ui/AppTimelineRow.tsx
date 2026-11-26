'use client';

import type { ReactNode } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AppTimelineRail from './AppTimelineRail';
import { glassSurface, selectedSurface } from '@/base/theme/surfaces';

export interface AppTimelineRowProps {
  icon?: ReactNode;
  railDetails?: ReactNode;
  title: string;
  meta?: ReactNode;
  leading?: ReactNode;
  railWidth?: number;
  children?: ReactNode;
  actions?: ReactNode;
  status?: ReactNode;
  hasNext?: boolean;
  spacingAfter?: number;
  selected?: boolean;
  onSelect?: () => void;
  showMedia?: boolean;
  mediaUrl?: string | null;
  media?: ReactNode;
}

/** Compact summary: one header, one title, one secondary row; controls stay siblings. */
const AppTimelineRow = ({
  icon, railDetails, title, meta, leading, railWidth, children, actions, status,
  hasNext = false, spacingAfter = 1, selected = false, onSelect, showMedia = false, mediaUrl, media,
}: AppTimelineRowProps) => {
  // Keep control hit targets above the visible header, so they do not shift its visual center.
  const compactControls = Boolean(leading && actions);
  const titleInHeader = !leading && Boolean(status || actions);
  const titleContent = <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, minWidth: 0, width: '100%' }}>
    <Typography component="span" noWrap title={title} sx={{ flex: 1, minWidth: 0, fontSize: { xs: 14, sm: 15 }, fontWeight: 600, lineHeight: 1.5 }}>{title}</Typography>
    {meta && <Box sx={{ flexShrink: 0, minWidth: 0 }}>{meta}</Box>}
  </Box>;
  // A sibling button covers the card; controls stay outside that button.
  const contentLayerSx = onSelect ? {
    position: 'relative',
    zIndex: 1,
    pointerEvents: 'none',
    '& button, & a, & input, & select, & textarea, & [role="button"], & [contenteditable="true"]': {
      pointerEvents: 'auto',
    },
  } as const : {};
  const textSx = {
    display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0.5,
    minWidth: 0, width: '100%', textAlign: 'left', color: 'text.primary',
  } as const;
  return <Box sx={{ display: 'flex', width: '100%', alignItems: 'stretch', minWidth: 0, gap: { xs: 'var(--app-timeline-gap, 6px)', sm: 'var(--app-timeline-gap, 8px)' } }}>
    {(icon || railDetails) && <AppTimelineRail marker={icon} details={railDetails} width={railWidth} hasNext={hasNext} />}
    <Box sx={{ flex: 1, minWidth: 0, pb: hasNext ? spacingAfter : 0 }}>
      <Box data-app-surface="card" sx={theme => ({
        ...glassSurface(theme), display: 'flex', alignItems: 'center', gap: 1,
        p: 1.5, py: compactControls ? 3 : 1.5, minWidth: 0, overflow: 'hidden', border: 1, position: 'relative',
        borderRadius: 'var(--app-radius-card)', borderColor: 'divider',
        ...(selected && { ...selectedSurface(theme), '& .MuiTypography-root': { color: 'inherit' } }),
      })}>
        {onSelect && <ButtonBase
          data-timeline-select
          type="button"
          disableRipple
          aria-label={title}
          aria-pressed={selected}
          onClick={onSelect}
          sx={{
            position: 'absolute', inset: 0, zIndex: 0, borderRadius: 'inherit',
            '&:hover': { bgcolor: 'action.hover' },
            '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
          }}
        />}
        {showMedia && <Box data-timeline-media sx={{
          ...contentLayerSx,
          width: { xs: 64, sm: 72 }, height: { xs: 64, sm: 72 }, aspectRatio: '1 / 1',
          flexShrink: 0, display: 'flex', overflow: 'hidden', borderRadius: 'var(--app-radius-small)',
          alignItems: 'center', justifyContent: 'center', bgcolor: 'action.selected', color: 'text.disabled',
          backgroundImage: !media && mediaUrl ? `url(${JSON.stringify(mediaUrl)})` : undefined,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}>
          {media}
          {!media && !mediaUrl && <ImageOutlinedIcon aria-hidden="true" sx={{ fontSize: 24 }} />}
        </Box>}
        <Box sx={{ ...contentLayerSx, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, minWidth: 0 }}>
          {(leading || status || actions) && <Box sx={{
            display: 'flex', alignItems: compactControls ? 'flex-end' : 'center', justifyContent: 'space-between',
            gap: 0.5, minWidth: 0, height: compactControls ? 24 : undefined,
          }}>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'flex-end' }}>
              {leading ?? <Box sx={textSx}>{titleContent}</Box>}
            </Box>
            {status && <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{status}</Box>}
            {actions && <Box sx={{ display: 'flex', flexShrink: 0 }}>{actions}</Box>}
          </Box>}
          {(!titleInHeader || children) && <Box sx={textSx}>
            {!titleInHeader && titleContent}
            {children}
          </Box>}
        </Box>
      </Box>
    </Box>
  </Box>;
};
export default AppTimelineRow;
