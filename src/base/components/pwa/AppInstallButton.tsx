'use client';

import { useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Box, ButtonBase, IconButton, Tooltip } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { AppButton, AppDialog, AppToast, AppLoadingIndicator } from '@/base/components/ui';
import {
  clearInstallError,
  getInstallState,
  getServerInstallState,
  requestInstallation,
  subscribeToInstall,
} from '@/base/pwa/install-store';

import AppPreferenceRow from '../preferences/AppPreferenceRow';
import IOSInstallGuide from './IOSInstallGuide';

interface AppInstallButtonProps {
  menuItem?: boolean;
  divider?: boolean;
  compact?: boolean;
}

const AppInstallButton = ({ menuItem = false, divider = false, compact = false }: AppInstallButtonProps) => {
  const t = useTranslations('pwa');
  const [guideOpen, setGuideOpen] = useState(false);
  const { status, isInstalling, hasError } = useSyncExternalStore(
    subscribeToInstall,
    getInstallState,
    getServerInstallState,
  );
  const opensGuide = status === 'ios';
  const visible = status === 'prompt' || status === 'ios';

  return (
    <>
      {visible && (
        menuItem ? (
          <Box sx={{ borderTop: divider ? 1 : 0, borderColor: 'divider' }}>
            <ButtonBase
              type="button"
              disableRipple
              disabled={isInstalling}
              aria-label={t('install')}
              aria-busy={isInstalling || undefined}
              aria-haspopup={opensGuide ? 'dialog' : undefined}
              aria-expanded={opensGuide ? guideOpen : undefined}
              onClick={() => {
                if (opensGuide) setGuideOpen(true);
                else void requestInstallation();
              }}
              sx={{
                display: 'flex', width: '100%', minHeight: compact ? 52 : 56,
                px: 0, py: 0, textAlign: 'left', justifyContent: 'flex-start',
                borderRadius: 'var(--app-radius-small)',
                bgcolor: 'transparent', color: 'text.primary',
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': { bgcolor: 'action.hover' },
                },
                '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
                '&.Mui-disabled': { color: 'text.disabled', bgcolor: 'transparent' },
              }}
            >
              <AppPreferenceRow compact={compact} icon={<DownloadRoundedIcon />} label={t('install')}>
                {isInstalling ? <AppLoadingIndicator /> : <ChevronRightRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />}
              </AppPreferenceRow>
            </ButtonBase>
          </Box>
        ) : (
          <Tooltip title={isInstalling ? '' : t('install')}>
            <IconButton
              type="button"
              loading={isInstalling}
              loadingIndicator={<AppLoadingIndicator />}
              aria-label={t('install')}
              aria-busy={isInstalling || undefined}
              aria-haspopup={opensGuide ? 'dialog' : undefined}
              aria-expanded={opensGuide ? guideOpen : undefined}
              onClick={() => {
                if (opensGuide) setGuideOpen(true);
                else void requestInstallation();
              }}
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                color: 'primary.main',
              }}
            >
              <DownloadRoundedIcon />
            </IconButton>
          </Tooltip>
        )
      )}
      <AppDialog
        mobilePresentation="sheet"
        showSheetHandle
        open={guideOpen && opensGuide}
        onClose={() => setGuideOpen(false)}
        title={t('iosTitle')}
        description={t('iosDescription')}
        icon={<DownloadRoundedIcon />}
        maxWidth="xs"
        actions={
          <AppButton onClick={() => setGuideOpen(false)}>
            {t('understood')}
          </AppButton>
        }
      >
        <IOSInstallGuide />
      </AppDialog>
      <AppToast
        open={hasError}
        severity="error"
        message={t('installError')}
        onClose={clearInstallError}
      />
    </>
  );
};

export default AppInstallButton;
