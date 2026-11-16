'use client';

import { useCallback, useEffect, useEffectEvent, useId, useRef, useState, type ReactNode, type Ref } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import useMobileOverlayBack from '@/base/hooks/use-mobile-overlay-back';
import { DialogDraftContext } from '@/base/hooks/use-dialog-draft';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AppButton from './AppButton';
import AppDialogSlide from './AppDialogSlide';

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
  mobilePresentation?: 'sheet' | 'dialog' | 'screen';
  protectChanges?: boolean;
  hasUnsavedChanges?: boolean;
  mobileCloseLabel?: string;
  contentRef?: Ref<HTMLDivElement>;
  showSheetHandle?: boolean;
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
  mobileFullScreen = false,
  mobilePresentation = 'sheet',
  mobileCloseLabel,
  contentRef,
  showSheetHandle = false,
  protectChanges = false,
  hasUnsavedChanges = false,
}: AppDialogProps) => {
  const t = useTranslations('dialog');
  const titleId = useId();
  const descriptionId = useId();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fullScreen = isMobile && (mobileFullScreen || mobilePresentation === 'screen');
  const isSheet = isMobile && !fullScreen && mobilePresentation === 'sheet';
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const draftChecks = useRef(new Set<() => boolean>());
  const [discardOpen, setDiscardOpen] = useState(false);
  const registerDraft = useCallback((check: () => boolean) => {
    draftChecks.current.add(check);
    return () => { draftChecks.current.delete(check); };
  }, []);
  const requestClose = () => {
    if (closeDisabled) return false;
    if (discardOpen) {
      setDiscardOpen(false);
      return false;
    }
    if (protectChanges && (hasUnsavedChanges || [...draftChecks.current].some((check) => check()))) {
      setDiscardOpen(true);
      return false;
    }
    onClose();
    return true;
  };
  useMobileOverlayBack(open && isMobile && !hideCloseButton, requestClose);
  const warnBeforeUnload = useEffectEvent((event: BeforeUnloadEvent) => {
    if (hasUnsavedChanges || [...draftChecks.current].some((check) => check())) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  useEffect(() => {
    if (!open || !protectChanges) return;
    const warn = (event: BeforeUnloadEvent) => warnBeforeUnload(event);
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [open, protectChanges]);

  return (
    <DialogDraftContext.Provider value={protectChanges ? registerDraft : null}>
      <Dialog
        open={open}
        data-app-dialog-id={titleId}
        onClose={requestClose}
        onClick={(event) => event.stopPropagation()}
        onClickCapture={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('[data-app-dialog-id]')?.getAttribute('data-app-dialog-id') !== titleId) return;
          const button = target.closest('[data-dialog-action="cancel"]');
          if (!button) return;
          event.preventDefault();
          event.stopPropagation();
          requestClose();
        }}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        fullWidth={fullWidth}
        fullScreen={fullScreen}
        maxWidth={maxWidth}
        slots={{ transition: isSheet ? AppDialogSlide : Fade }}
        transitionDuration={reducedMotion ? 0 : isSheet ? { enter: 220, exit: 180 } : undefined}
        slotProps={{
          container: {
            sx: isSheet ? {
              alignItems: 'flex-end',
            } : !fullScreen ? {
              [theme.breakpoints.down('sm')]: {
                px: 'max(16px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px))',
                py: 'max(16px, env(safe-area-inset-top, 0px), env(safe-area-inset-bottom, 0px))',
              },
            } : undefined,
          },
          paper: {
            sx: {
              borderRadius: fullScreen ? 0 : 'var(--app-radius-dialog)',
              p: 0,
              ...(!fullScreen && !isSheet && {
                [theme.breakpoints.down('sm')]: {
                  // Container padding owns the inset; reset MUI's default margin.
                  m: 0,
                  width: fullWidth ? '100%' : 'auto',
                  maxHeight: 'min(var(--app-dialog-max-height), calc(100dvh - 32px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px)))',
                  borderRadius: 'var(--app-radius-dialog)',
                  minWidth: 0,
                },
              }),
              ...(isSheet && {
                // Fit content from the bottom; long sheets leave the page visible above.
                m: 0,
                width: '100%',
                maxWidth: '100%',
                height: 'auto',
                maxHeight: 'calc(100dvh - max(48px, env(safe-area-inset-top, 0px)))',
                borderRadius: 'var(--app-radius-dialog) var(--app-radius-dialog) 0 0',
                pb: 'env(safe-area-inset-bottom, 0px)',
                pl: 'env(safe-area-inset-left, 0px)',
                pr: 'env(safe-area-inset-right, 0px)',
                ...(!hideCloseButton && {
                  '& .MuiButton-root[data-dialog-action="cancel"]': { display: 'none' },
                }),
                '& .MuiButton-root[data-dialog-action="primary"]': {
                  width: '100%',
                  minWidth: 0,
                  flex: '1 0 100%',
                  ml: 0,
                },
              }),
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
        {isSheet && showSheetHandle && (
          <Box aria-hidden="true" sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, flexShrink: 0 }}>
            <Box sx={{ width: 36, height: 4, borderRadius: 'var(--app-radius-pill)', bgcolor: 'text.disabled' }} />
          </Box>
        )}
        <DialogTitle
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            px: 2,
            py: 0.75,
            minHeight: 'var(--app-dialog-header-height)',
            flexShrink: 0,
            ...(isSheet && {
              minHeight: 'var(--app-dialog-header-height)',
              py: 0.75,
              borderBottom: 1,
              borderColor: 'divider',
            }),
            ...(fullScreen && {
              minHeight: 'var(--app-dialog-header-height)',
              py: 0.75,
              borderBottom: 1,
              borderColor: 'divider',
            }),
          }}
        >
          {fullScreen && (
            <Box sx={{ flex: '0 0 var(--app-dialog-control-size)', minWidth: 0 }}>
              {!hideCloseButton && (
                <IconButton
                  onClick={requestClose}
                  disabled={closeDisabled}
                  aria-label={mobileCloseLabel ?? t('back')}
                  sx={{ width: 'var(--app-dialog-control-size)', height: 'var(--app-dialog-control-size)' }}
                >
                  <ArrowBackRoundedIcon />
                </IconButton>
              )}
            </Box>
          )}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', minWidth: 0, flex: 1 }}
          >
            {icon && !fullScreen && !isSheet && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--app-radius-control)',
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
              {description && (
                <Typography
                  id={descriptionId}
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    lineHeight: 1.4,
                    ...(fullScreen && { textAlign: 'center' }),
                    overflowWrap: 'anywhere',
                  }}
                >
                  {description}
                </Typography>
              )}
            </Box>
          </Stack>

          {fullScreen && <Box aria-hidden="true" sx={{ flex: '0 0 var(--app-dialog-control-size)' }} />}

          {!hideCloseButton && !fullScreen && !isSheet && (
            <IconButton
              onClick={requestClose}
              disabled={closeDisabled}
              size="small"
              aria-label={closeLabel ?? t('close')}
              sx={{ width: 'var(--app-dialog-control-size)', height: 'var(--app-dialog-control-size)', flexShrink: 0 }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent
          ref={contentRef}
          sx={{
            p: 2,
            // MUI removes top padding immediately after DialogTitle; keep one shared inset.
            '.MuiDialogTitle-root + &': { pt: 2 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            minHeight: 0,
            ...(isSheet && { flex: '0 1 auto' }),
            overflowY: 'auto',
            overscrollBehaviorY: 'contain',
          }}
        >
          {children}
        </DialogContent>

        {actions && (
          <DialogActions
            disableSpacing
            sx={{
              px: 2,
              // Đệm dưới của nội dung đã tạo khoảng cách; không cộng thêm đệm trên.
              pt: 0,
              pb: 2,
              gap: 1.5,
              flexWrap: 'wrap',
              flexShrink: 0,
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
      <Dialog
        open={open && discardOpen}
        onClose={() => setDiscardOpen(false)}
        aria-labelledby={`${titleId}-discard`}
        aria-describedby={`${descriptionId}-discard`}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id={`${titleId}-discard`}>{t('discardTitle')}</DialogTitle>
        <DialogContent id={`${descriptionId}-discard`}>{t('discardDescription')}</DialogContent>
        <DialogActions disableSpacing sx={{ p: 2, gap: 1, flexWrap: 'wrap', '& > .MuiButton-root': { flex: '1 1 auto', minWidth: 0 } }}>
          <AppButton intent="secondary" wrapLabel onClick={() => setDiscardOpen(false)}>{t('keepEditing')}</AppButton>
          <AppButton intent="danger" wrapLabel disabled={closeDisabled} onClick={() => {
            setDiscardOpen(false);
            onClose();
          }}>{t('discard')}</AppButton>
        </DialogActions>
      </Dialog>
    </DialogDraftContext.Provider>
  );
};

export default AppDialog;
