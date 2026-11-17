'use client';

import type { ReactNode } from 'react';
import { Box } from '@mui/material';

export interface AppTimelineRailProps {
  marker?: ReactNode;
  details?: ReactNode;
  hasNext?: boolean;
  width?: number;
}

const AppTimelineRail = ({
  marker,
  details,
  hasNext = false,
  width,
}: AppTimelineRailProps) => {
  const lineSx = {
    width: 0,
    borderLeft: '1px dashed',
    borderColor: 'divider',
  };
  return (
    <Box
      sx={{
        width: width ?? 'var(--app-timeline-rail-width, 28px)',
        minWidth: 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch',
      }}
    >
      {marker || details ? (
        <>
          {marker && <Box aria-hidden="true" sx={{ display: 'flex' }}>{marker}</Box>}
          {details && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, pt: marker ? 0.5 : 0 }}>{details}</Box>}
          <Box aria-hidden="true" sx={{ flex: 1, minHeight: hasNext ? 8 : 0, ...(hasNext ? lineSx : {}) }} />
        </>
      ) : (
        <Box aria-hidden="true" sx={{ ...lineSx, flex: 1 }} />
      )}
    </Box>
  );
};

export default AppTimelineRail;
