'use client';

import type { ReactNode } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AppTimelineRail from './AppTimelineRail';

export interface AppTimelineRowProps {
  // Bỏ trống thì không vẽ trục thời gian (thẻ đơn lẻ).
  icon?: ReactNode;
  title: string;
  meta?: ReactNode;
  // Hàng phụ nằm ngang phía trên tiêu đề (ví dụ nhãn giờ).
  leading?: ReactNode;
  railWidth?: number;
  children?: ReactNode;
  actions?: ReactNode;
  hasNext?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  // Ô ảnh bên trái, cao hết thẻ; chưa có ảnh thì hiện khung trống.
  showMedia?: boolean;
  mediaUrl?: string | null;
  media?: ReactNode;
}

const AppTimelineRow = ({
  icon,
  title,
  meta,
  leading,
  railWidth,
  children,
  actions,
  hasNext = false,
  selected = false,
  onSelect,
  showMedia = false,
  mediaUrl,
  media,
}: AppTimelineRowProps) => (
  <Box
    sx={{
      display: 'flex',
      width: '100%',
      alignItems: 'stretch',
      minWidth: 0,
      gap: { xs: 0.75, sm: 1 },
    }}
  >
    {icon && (
      <AppTimelineRail marker={icon} width={railWidth} hasNext={hasNext} />
    )}
    <Box sx={{ flex: 1, minWidth: 0, pb: hasNext ? 1 : 0 }}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          border: 1,
          borderRadius: '14px',
          borderColor: selected ? 'primary.main' : 'divider',
          bgcolor: selected ? 'action.selected' : 'background.paper',
        }}
      >
        {showMedia && (
          <Box
            sx={{
              width: { xs: '96px', sm: '120px' },
              flexShrink: 0,
              minHeight: '112px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.selected',
              color: 'text.disabled',
              backgroundImage: !media && mediaUrl ? `url("${mediaUrl}")` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {media}
            {!media && !mediaUrl && (
              <Box
                aria-hidden="true"
                sx={{
                  flex: 1,
                  alignSelf: 'stretch',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ImageOutlinedIcon sx={{ fontSize: '28px' }} />
              </Box>
            )}
          </Box>
        )}
        <Box
          component={onSelect ? ButtonBase : 'div'}
          onClick={onSelect}
          aria-pressed={onSelect ? selected : undefined}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            flex: 1,
            minWidth: 0,
            gap: 0.75,
            p: { xs: 1.25, sm: 1.5 },
            textAlign: 'left',
            borderRadius: '14px',
            color: 'text.primary',
            '&:hover': onSelect ? { bgcolor: 'action.hover' } : undefined,
            '&.Mui-focusVisible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: -2,
            },
          }}
        >
          {leading}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1,
              minWidth: 0,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              component="span"
              sx={{
                flex: '1 1 120px',
                minWidth: 0,
                fontSize: { xs: '14px', sm: '15px' },
                fontWeight: 700,
                lineHeight: 1.5,
                overflowWrap: 'anywhere',
              }}
            >
              {title}
            </Typography>
            {meta && (
              <Box
                sx={{ minWidth: 0, maxWidth: '100%', overflowWrap: 'anywhere' }}
              >
                {meta}
              </Box>
            )}
          </Box>
          {children}
        </Box>
        {actions && (
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'flex-start',
              pt: 0.5,
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  </Box>
);

export default AppTimelineRow;
