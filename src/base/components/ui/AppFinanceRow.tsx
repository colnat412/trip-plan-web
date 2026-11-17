'use client';

import type { ReactNode } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { useFinanceStyle } from '@/base/providers/FinanceStyleProvider';

export interface AppFinanceRowProps {
  icon: ReactNode;
  title: string;
  subtitle?: ReactNode;
  amount: ReactNode;
  amountCaption?: ReactNode;
  amountColor?: string;
  action?: ReactNode;
  actionPlacement?: 'row' | 'amount';
  onClick?: () => void;
  // Keep identity details beside the amount for dense detail lists.
  compact?: boolean;
  dense?: boolean;
  highlighted?: boolean;
}

const AppFinanceRow = ({
  icon,
  title,
  subtitle,
  amount,
  amountCaption,
  amountColor = 'text.primary',
  action,
  actionPlacement = 'row',
  onClick,
  compact = false,
  dense = false,
  highlighted = false,
}: AppFinanceRowProps) => {
  const finance = useFinanceStyle();
  const isCompact = compact || finance || dense;
  const titleContent = (
    <Typography
      component="span"
      sx={{
        flex: isCompact ? undefined : '1 1 96px',
        minWidth: 0,
        fontSize: finance && !dense ? '15px' : '14px',
        lineHeight: 1.5,
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
        fontSize: finance && !dense ? '13px' : '12px',
        fontWeight: 400,
        lineHeight: 1.5,
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
      data-finance-row
      data-density={dense ? 'dense' : undefined}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 0.5,
        width: '100%',
        minWidth: 0,
        borderBottom: 1,
        borderColor: 'divider',
        ...(highlighted && {
          bgcolor: 'action.selected', borderRadius: 'var(--app-radius-small)',
          boxShadow: (theme) => `inset 2px 0 0 ${(theme.vars?.palette ?? theme.palette).primary.main}`,
        }),
        '&:last-child': { borderBottom: 0 },
      }}
    >
      <Box
        component={onClick ? ButtonBase : 'div'}
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: actionPlacement === 'amount' ? 'center' : 'flex-start',
          gap: isCompact ? 1 : 1.25,
          py: dense ? 1 : isCompact ? 1.25 : 1.5,
          px: dense ? 0.5 : 1.5,
          minHeight: dense ? 44 : undefined,
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
              alignItems: actionPlacement === 'amount' ? 'center' : 'baseline',
              flexWrap: 'wrap',
              gap: 0.75,
              minWidth: 0,
            }}
          >
            {isCompact ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, flex: '1 1 96px', minWidth: 0 }}>
                {titleContent}
                {subtitleContent}
              </Box>
            ) : titleContent}
            <Box
              sx={{
                display: 'flex',
                flexDirection: actionPlacement === 'amount' ? 'row' : 'column',
                alignItems: actionPlacement === 'amount' ? 'center' : 'flex-end',
                gap: 0.5,
                minWidth: 0,
                maxWidth: '100%',
                flex: '0 1 auto',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 0, gap: 0.5 }}>
                <Typography
                  component="span"
                  sx={{
                    fontSize: finance && !dense ? '16px' : '14px',
                    lineHeight: 1.5,
                    fontWeight: 700,
                    color: amountColor,
                    whiteSpace: isCompact ? 'normal' : 'nowrap',
                    textAlign: 'right',
                    overflowWrap: 'anywhere',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {amount}
                </Typography>
                {amountCaption}
              </Box>
              {actionPlacement === 'amount' && action}
            </Box>
          </Box>
          {!isCompact && subtitleContent}
        </Box>
      </Box>
      {actionPlacement === 'row' && action && <Box sx={{ flexShrink: 0, pt: 0.5 }}>{action}</Box>}
    </Box>
  );
};

export default AppFinanceRow;
