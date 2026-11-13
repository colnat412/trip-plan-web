'use client';

import type { ReactNode } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';

export interface AppFinanceRowProps {
  icon: ReactNode;
  title: string;
  subtitle?: ReactNode;
  amount: ReactNode;
  amountCaption?: ReactNode;
  amountColor?: string;
  action?: ReactNode;
  onClick?: () => void;
  // Keep identity details beside the amount for dense detail lists.
  compact?: boolean;
}

const AppFinanceRow = ({
  icon,
  title,
  subtitle,
  amount,
  amountCaption,
  amountColor = 'text.primary',
  action,
  onClick,
  compact = false,
}: AppFinanceRowProps) => {
  const titleContent = (
    <Typography
      component="span"
      sx={{
        flex: compact ? undefined : '1 1 96px',
        minWidth: 0,
        fontSize: '14px',
        fontWeight: 600,
        overflowWrap: 'anywhere',
      }}
    >
      {title}
    </Typography>
  );
  const subtitleContent = subtitle && (
    <Box
      sx={{
        fontSize: '12px',
        color: 'text.secondary',
        minWidth: 0,
        overflowWrap: 'anywhere',
      }}
    >
      {subtitle}
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 0.5,
        width: '100%',
        minWidth: 0,
        borderBottom: 1,
        borderColor: 'divider',
        '&:last-child': { borderBottom: 0 },
      }}
    >
      <Box
        component={onClick ? ButtonBase : 'div'}
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: compact ? 1 : 1.25,
          py: compact ? 1.25 : 1.5,
          px: 1.5,
          minWidth: 0,
          flex: 1,
          textAlign: 'left',
          borderRadius: 'var(--app-radius-small)',
          color: 'text.primary',
          '& > .MuiAvatar-root': { flexShrink: 0 },
          '&:hover': onClick ? { bgcolor: 'action.hover' } : undefined,
          '&.Mui-focusVisible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: -2,
          },
        }}
      >
        {icon}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: 0.75,
              minWidth: 0,
            }}
          >
            {compact ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, flex: '1 1 96px', minWidth: 0 }}>
                {titleContent}
                {subtitleContent}
              </Box>
            ) : titleContent}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 0.5,
                minWidth: 0,
                maxWidth: '100%',
                flex: '0 1 auto',
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: amountColor,
                  whiteSpace: compact ? 'normal' : 'nowrap',
                  textAlign: 'right',
                  overflowWrap: 'anywhere',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {amount}
              </Typography>
              {amountCaption}
            </Box>
          </Box>
          {!compact && subtitleContent}
        </Box>
      </Box>
      {action && <Box sx={{ flexShrink: 0, pt: 0.5 }}>{action}</Box>}
    </Box>
  );
};

export default AppFinanceRow;
