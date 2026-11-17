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
  selected?: boolean;
  onSelect?: () => void;
  showMedia?: boolean;
  mediaUrl?: string | null;
  media?: ReactNode;
}

/** Compact summary: one header, one title, one secondary row; controls stay siblings. */
const AppTimelineRow = ({
  icon, railDetails, title, meta, leading, railWidth, children, actions, status,
  hasNext = false, selected = false, onSelect, showMedia = false, mediaUrl, media,
}: AppTimelineRowProps) => {
  const titleInHeader = !leading && Boolean(status || actions);
  const titleContent = <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, minWidth: 0, width: '100%' }}>
    <Typography component="span" noWrap title={title} sx={{ flex: 1, minWidth: 0, fontSize: { xs: 14, sm: 15 }, fontWeight: 600, lineHeight: 1.5 }}>{title}</Typography>
    {meta && <Box sx={{ flexShrink: 0, minWidth: 0 }}>{meta}</Box>}
  </Box>;
  const selectSx = {
    display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0.5,
    minWidth: 0, width: '100%', textAlign: 'left', color: 'text.primary',
    borderRadius: 'var(--app-radius-small)',
    '&:hover': onSelect ? { bgcolor: 'action.hover' } : undefined,
    '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
  } as const;
  return <Box sx={{ display: 'flex', width: '100%', alignItems: 'stretch', minWidth: 0, gap: { xs: 'var(--app-timeline-gap, 6px)', sm: 'var(--app-timeline-gap, 8px)' } }}>
    {(icon || railDetails) && <AppTimelineRail marker={icon} details={railDetails} width={railWidth} hasNext={hasNext} />}
    <Box sx={{ flex: 1, minWidth: 0, pb: hasNext ? 1 : 0 }}>
      <Box data-app-surface="card" sx={theme => ({
        ...glassSurface(theme), display: 'flex', alignItems: 'center', gap: 1,
        p: 1.5, minWidth: 0, overflow: 'hidden', border: 1,
        borderRadius: 'var(--app-radius-card)', borderColor: 'divider',
        ...(selected && { ...selectedSurface(theme), '& .MuiTypography-root': { color: 'inherit' } }),
      })}>
        {showMedia && <Box data-timeline-media sx={{
          width: { xs: 64, sm: 72 }, height: { xs: 64, sm: 72 }, aspectRatio: '1 / 1',
          flexShrink: 0, display: 'flex', overflow: 'hidden', borderRadius: 'var(--app-radius-small)',
          alignItems: 'center', justifyContent: 'center', bgcolor: 'action.selected', color: 'text.disabled',
          backgroundImage: !media && mediaUrl ? `url(${JSON.stringify(mediaUrl)})` : undefined,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}>
          {media}
          {!media && !mediaUrl && <ImageOutlinedIcon aria-hidden="true" sx={{ fontSize: 24 }} />}
        </Box>}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, minWidth: 0 }}>
          {(leading || status || actions) && <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, minWidth: 0 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {leading ?? <Box component={onSelect ? ButtonBase : 'div'} onClick={onSelect} aria-pressed={onSelect ? selected : undefined} sx={selectSx}>{titleContent}</Box>}
            </Box>
            {status && <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{status}</Box>}
            {actions && <Box sx={{ display: 'flex', flexShrink: 0 }}>{actions}</Box>}
          </Box>}
          {(!titleInHeader || children) && <Box component={onSelect ? ButtonBase : 'div'} onClick={onSelect} aria-pressed={onSelect ? selected : undefined} sx={selectSx}>
            {!titleInHeader && titleContent}
            {children}
          </Box>}
        </Box>
      </Box>
    </Box>
  </Box>;
};
export default AppTimelineRow;
