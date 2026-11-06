'use client';

import { Box } from '@mui/material';

interface AppErrorIllustrationProps {
  compact?: boolean;
}

const AppErrorIllustration = ({
  compact = false,
}: AppErrorIllustrationProps) => (
  <Box
    component="svg"
    viewBox="0 0 200 144"
    aria-hidden="true"
    focusable="false"
    sx={(theme) => ({
      display: 'block',
      width: compact ? 112 : 184,
      height: compact ? 80 : 132,
      maxWidth: '100%',
      color: 'primary.main',
      '--error-art-accent': (theme.vars?.palette ?? theme.palette).secondary
        .main,
    })}
  >
    <ellipse
      cx="101"
      cy="129"
      rx="66"
      ry="7"
      fill="currentColor"
      opacity="0.07"
    />
    <circle cx="101" cy="73" r="55" fill="currentColor" opacity="0.045" />
    <path
      d="M25 88c-15-20 6-36 22-25M155 102c30-2 31-31 13-39"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="3 7"
      strokeLinecap="round"
      opacity="0.35"
    />
    <path
      d="M55 123V58a11 11 0 0 1 11-11h64a11 11 0 0 1 11 11v65"
      fill="var(--mui-palette-background-paper)"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M83 46v-8a7 7 0 0 1 7-7h16a7 7 0 0 1 7 7v8"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
    <rect
      x="55"
      y="48"
      width="86"
      height="76"
      rx="11"
      fill="currentColor"
      opacity="0.08"
    />
    <path
      d="M69 61v48M126 61v48"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.25"
    />
    <path
      d="m77 75 17-5 18 7v29l-18-7-17 5z"
      fill="var(--mui-palette-background-paper)"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M94 71v27m-10-11 5-3 10 7 7-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="2 4"
      opacity="0.6"
    />
    <rect x="67" y="123" width="10" height="6" rx="3" fill="currentColor" />
    <rect x="120" y="123" width="10" height="6" rx="3" fill="currentColor" />
    <circle
      cx="145"
      cy="53"
      r="21"
      fill="var(--mui-palette-background-paper)"
    />
    <circle
      cx="145"
      cy="53"
      r="17"
      fill="var(--error-art-accent)"
      opacity="0.18"
    />
    <path
      d="M141 46v13m8-13v13"
      stroke="var(--error-art-accent)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="m40 34 2-5 2 5 5 2-5 2-2 5-2-5-5-2z"
      fill="var(--error-art-accent)"
      opacity="0.8"
    />
    <circle cx="164" cy="114" r="3" fill="currentColor" opacity="0.25" />
  </Box>
);

export default AppErrorIllustration;
