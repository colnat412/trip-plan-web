'use client';

import type { ReactNode } from 'react';
import NextLink from 'next/link';
import { ButtonBase } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

export interface AppSectionLinkProps {
  href: string;
  children: ReactNode;
  label?: string;
}

const AppSectionLink = ({ href, children, label }: AppSectionLinkProps) => (
  <ButtonBase
    component={NextLink}
    href={href}
    aria-label={label}
    disableRipple
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 0.5,
      minHeight: 44,
      minWidth: 0,
      maxWidth: '100%',
      color: 'primary.main',
      fontSize: '13px',
      fontWeight: 600,
      overflowWrap: 'anywhere',
      borderRadius: 'var(--app-radius-small)',
      textDecoration: 'none',
      '&:hover, &:active, &:focus': { textDecoration: 'none' },
      '&:focus-visible, &.Mui-focusVisible': {
        outline: '2px solid',
        outlineColor: 'primary.main',
        outlineOffset: 2,
      },
    }}
  >
    {children}
    <ChevronRightRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
  </ButtonBase>
);

export default AppSectionLink;
