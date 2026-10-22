'use client';

import { useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { AppButton, AppDialog, AppToast } from '@/base/components/ui';
import {
  clearInstallError,
  getInstallState,
  getServerInstallState,
  requestInstallation,
  subscribeToInstall,
} from '@/base/pwa/install-store';

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
            aria-haspopup={status === 'ios' ? 'dialog' : undefined}
            aria-expanded={status === 'ios' ? guideOpen : undefined}
            startIcon={<DownloadRoundedIcon sx={{ fontSize: '18px' }} />}
            onClick={() => {
              if (status === 'ios') setGuideOpen(true);
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
              aria-label={t('install')}
              aria-busy={isInstalling || undefined}
              aria-haspopup={status === 'ios' ? 'dialog' : undefined}
              aria-expanded={status === 'ios' ? guideOpen : undefined}
              onClick={() => {
                if (status === 'ios') setGuideOpen(true);
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
        open={guideOpen && status === 'ios'}
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
        <Stack spacing={1.5}>
          <Typography>{t('iosShare')}</Typography>
          <Typography>{t('iosAdd')}</Typography>
          <Typography>{t('iosConfirm')}</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '13px' }}>
            {t('iosBrowserHint')}
          </Typography>
        </Stack>
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
