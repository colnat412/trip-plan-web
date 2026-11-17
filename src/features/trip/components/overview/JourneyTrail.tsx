'use client';

import { Box } from '@mui/material';

/** A small travel/water motif under the companion, outside the text area. */
const JourneyTrail = () => (
  <Box component="svg" viewBox="0 0 88 16" aria-hidden="true" focusable="false"
    sx={{ display: 'block', width: 88, height: 16, color: 'primary.main', opacity: 0.24,
      '@media (prefers-contrast: more), (forced-colors: active)': { display: 'none' } }}>
    <path d="M3 8c10-8 18 8 28 0s18 8 28 0 17 4 23-2" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <path d="M12 14c11-6 18 3 29-1s18 3 29-1" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
    <circle cx="83" cy="5" r="2.5" fill="currentColor" />
  </Box>
);
export default JourneyTrail;
