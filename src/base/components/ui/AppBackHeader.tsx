'use client';

import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AppBackButton from './AppBackButton';

export interface AppBackHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  backHref?: string;
  onBack?: () => void;
  backLabel?: string;
  backDisabled?: boolean;
  hideBack?: boolean;
  actions?: ReactNode;
  titleId?: string;
  descriptionId?: string;
  headingComponent?: 'h1' | 'h2';
  titleAlign?: 'center' | 'left';
}

/** Equal side columns keep the heading centered even without a trailing action. */
const AppBackHeader = ({
  title, description, backHref, onBack, backLabel, backDisabled = false,
  hideBack = false, actions, titleId, descriptionId, headingComponent = 'h1', titleAlign = 'center',
}: AppBackHeaderProps) => {
  return (
    <Box sx={{
      display: 'grid', gridTemplateColumns: titleAlign === 'left' ? '44px minmax(0, 1fr) auto' : '44px minmax(0, 1fr) 44px',
      alignItems: 'center', gap: 1, minHeight: 56, py: 0.5, width: '100%', minWidth: 0,
      boxSizing: 'border-box',
    }}>
      <Box sx={{ width: 44, minWidth: 0 }}>
        {!hideBack && <AppBackButton href={backHref} onClick={onBack} disabled={backDisabled} label={backLabel} />}
      </Box>
      <Stack spacing={0.25} sx={{ textAlign: titleAlign, minWidth: 0, overflowWrap: 'anywhere' }}>
        <Typography id={titleId} component={headingComponent} noWrap title={typeof title === 'string' ? title : undefined} sx={{
          fontFamily: 'var(--font-display)', fontSize: titleAlign === 'left' ? { xs: 15, sm: 16 } : { xs: 16, sm: 17 },
          fontWeight: 600, lineHeight: 1.4, color: 'text.primary',
        }}>{title}</Typography>
        {description && <Typography id={descriptionId} variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>{description}</Typography>}
      </Stack>
      <Box aria-hidden={actions ? undefined : true} sx={{ width: titleAlign === 'left' && actions ? 'auto' : 44, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {actions}
      </Box>
    </Box>
  );
};

export default AppBackHeader;
