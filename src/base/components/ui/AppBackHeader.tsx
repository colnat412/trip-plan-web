'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { useTranslations } from 'next-intl';

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
}

/** Equal side columns keep the heading centered even without a trailing action. */
const AppBackHeader = ({
  title, description, backHref, onBack, backLabel, backDisabled = false,
  hideBack = false, actions, titleId, descriptionId, headingComponent = 'h1',
}: AppBackHeaderProps) => {
  const t = useTranslations('dialog');
  const backButtonSx = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    bgcolor: 'background.paper',
    color: 'text.primary',
    border: 1,
    borderColor: 'divider',
    '&:hover': { bgcolor: 'action.hover' },
    '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 3 },
  };

  return (
    <Box sx={{
      display: 'grid', gridTemplateColumns: '48px minmax(0, 1fr) 48px',
      alignItems: 'center', gap: 1.5, minHeight: 80, py: 1.5, width: '100%', minWidth: 0,
    }}>
      <Box sx={{ width: 48, minWidth: 0 }}>
        {!hideBack && (backHref ? (
          <IconButton component={Link} href={backHref} disabled={backDisabled} aria-label={backLabel ?? t('back')} sx={backButtonSx}>
            <ChevronLeftRoundedIcon sx={{ fontSize: 28 }} />
          </IconButton>
        ) : (
          <IconButton onClick={onBack} disabled={backDisabled} aria-label={backLabel ?? t('back')} sx={backButtonSx}>
            <ChevronLeftRoundedIcon sx={{ fontSize: 28 }} />
          </IconButton>
        ))}
      </Box>
      <Stack spacing={0.5} sx={{ textAlign: 'center', minWidth: 0, overflowWrap: 'anywhere' }}>
        <Typography id={titleId} component={headingComponent} sx={{
          fontFamily: 'var(--font-display)', fontSize: { xs: 18, sm: 20 },
          fontWeight: 700, lineHeight: 1.5, color: 'text.primary',
        }}>{title}</Typography>
        {description && <Typography id={descriptionId} variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>{description}</Typography>}
      </Stack>
      <Box aria-hidden={actions ? undefined : true} sx={{ width: 48, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {actions}
      </Box>
    </Box>
  );
};

export default AppBackHeader;
