'use client';

import { useId, type ReactNode, type Ref } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AppButton from './AppButton';

export interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  closeDisabled?: boolean;
  hideCloseButton?: boolean;
  closeLabel?: string;
  mobileFullScreen?: boolean;
  mobileCloseLabel?: string;
  contentRef?: Ref<HTMLDivElement>;
}

const AppDialog = ({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  closeDisabled = false,
  hideCloseButton = false,
  closeLabel,
  mobileFullScreen = true,
  mobileCloseLabel,
  contentRef,
}: AppDialogProps) => {
  const t = useTranslations('dialog');
  const titleId = useId();
  const descriptionId = useId();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fullScreen = mobileFullScreen && isMobile;
  return (
    <Dialog
      open={open}
      onClose={closeDisabled ? undefined : onClose}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      slotProps={{
        paper: {
          sx: {
            borderRadius: fullScreen ? 0 : '20px',
            p: fullScreen ? 0 : { xs: 1, sm: 2 },
            ...(fullScreen && {
              height: '100dvh',
              pt: 'env(safe-area-inset-top, 0px)',
              pb: 'env(safe-area-inset-bottom, 0px)',
              pl: 'env(safe-area-inset-left, 0px)',
              pr: 'env(safe-area-inset-right, 0px)',
              // Only explicitly marked footer actions participate in this layout.
              ...(!hideCloseButton && {
                '& .MuiButton-root[data-dialog-action="cancel"]': {
                  display: 'none',
                },
              }),
              '& .MuiButton-root[data-dialog-action="primary"]': {
                width: '100%',
                minWidth: 0,
                flex: '1 0 100%',
                ml: 0,
              },
            }),
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          p: { xs: 2, sm: 2.5 },
          pb: 1.5,
          flexShrink: 0,
          ...(fullScreen && {
            minHeight: 64,
            py: 1,
            flexWrap: 'wrap',
            borderBottom: 1,
            borderColor: 'divider',
          }),
        }}
      >
        {fullScreen && (
          <Box sx={{ flex: '0 0 64px', minWidth: 0 }}>
            {!hideCloseButton && (
              <AppButton
                intent="text"
                size="medium"
                wrapLabel
                onClick={onClose}
                disabled={closeDisabled}
                sx={{ minHeight: 44, minWidth: 0, width: '100%', px: 0.5 }}
              >
                {mobileCloseLabel ?? t('exit')}
              </AppButton>
            )}
          </Box>
        )}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', minWidth: 0, flex: 1 }}
        >
          {icon && !fullScreen && (
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
          <Box sx={{ minWidth: 0, ...(fullScreen && { width: '100%' }) }}>
            <Typography
              id={titleId}
              component="h2"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '18px', sm: '20px' },
                fontWeight: 700,
                color: 'text.primary',
                overflowWrap: 'anywhere',
                ...(fullScreen && {
                  fontSize: '16px',
                  lineHeight: 1.5,
                  textAlign: 'center',
                }),
              }}
            >
              {title}
            </Typography>
            {description && !fullScreen && (
              <Typography
                id={descriptionId}
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  overflowWrap: 'anywhere',
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Stack>

        {fullScreen && <Box aria-hidden="true" sx={{ flex: '0 0 64px' }} />}

        {description && fullScreen && (
          <Typography
            id={descriptionId}
            variant="caption"
            sx={{
              flexBasis: '100%',
              minWidth: 0,
              color: 'text.secondary',
              textAlign: 'center',
              overflowWrap: 'anywhere',
            }}
          >
            {description}
          </Typography>
        )}

        {!hideCloseButton && !fullScreen && (
          <IconButton
            onClick={onClose}
            disabled={closeDisabled}
            size="small"
            aria-label={closeLabel ?? t('close')}
            sx={{ width: 44, height: 44, flexShrink: 0 }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent
        ref={contentRef}
        sx={{
          p: { xs: 2, sm: 2.5 },
          pt: '20px !important',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          disableSpacing
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 2,
            gap: 1.5,
            flexWrap: 'wrap',
            '& > .MuiButton-root': {
              flex: { xs: '1 0 auto', sm: '0 0 auto' },
              minWidth: 0,
              maxWidth: '100%',
              overflowWrap: 'anywhere',
            },
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AppDialog;
