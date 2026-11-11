'use client';

import { useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { IconButton, Tooltip } from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { AppButton, AppDialog, AppToast, AppLoadingIndicator } from '@/base/components/ui';
import {
  clearInstallError,
  getInstallState,
  getServerInstallState,
  requestInstallation,
  subscribeToInstall,
} from '@/base/pwa/install-store';

import IOSInstallGuide from './IOSInstallGuide';

interface AppInstallButtonProps {
  menuItem?: boolean;
}

const AppInstallButton = ({ menuItem = false }: AppInstallButtonProps) => {
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
          <AppButton
            type="button"
            intent="text"
            size="small"
            loading={isInstalling}
            aria-label={t('install')}
            aria-busy={isInstalling || undefined}
            aria-haspopup={opensGuide ? 'dialog' : undefined}
            aria-expanded={opensGuide ? guideOpen : undefined}
            startIcon={<DownloadRoundedIcon sx={{ fontSize: '18px' }} />}
            onClick={() => {
              if (opensGuide) setGuideOpen(true);
              else void requestInstallation();
            }}
            sx={{
              width: '100%',
              minHeight: 56,
              justifyContent: 'flex-start',
              px: 1,
              color: 'text.primary',
              '& .MuiButton-startIcon': {
                width: 18,
                color: 'text.secondary',
              },
              '&:hover': {
                color: 'text.primary',
                bgcolor: 'action.hover',
              },
            }}
          >
            {t('install')}
          </AppButton>
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
