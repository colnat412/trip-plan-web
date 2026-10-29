'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';

export default function TemplateBanner({ src, title, compact = false }: {
  src?: string | null;
  title: string;
  compact?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const visibleSrc = src && src !== failedSrc ? src : null;
  return (
    <Box sx={{
      width: '100%', minWidth: 0, height: compact ? 120 : { xs: 180, sm: 220 },
      bgcolor: 'action.hover', borderRadius: '12px', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main',
    }}>
      {visibleSrc ? (
        <Box component="img" src={visibleSrc} alt={title} loading="lazy"
          onError={() => setFailedSrc(visibleSrc)}
          sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : <RouteRoundedIcon sx={{ fontSize: compact ? 36 : 48 }} aria-hidden="true" />}
    </Box>
  );
}
