'use client';

import type { ReactNode } from 'react';
import { Box } from '@mui/material';

export interface AppTimelineRailProps {
  marker?: ReactNode;
  hasNext?: boolean;
  width?: number;
}

const AppTimelineRail = ({
  marker,
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
      aria-hidden="true"
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
      {marker ? (
        <>
          {marker}
          <Box sx={{ flex: 1, minHeight: 12, ...(hasNext ? lineSx : {}) }} />
        </>
      ) : (
        <Box sx={{ ...lineSx, flex: 1 }} />
      )}
    </Box>
  );
};

export default AppTimelineRail;
