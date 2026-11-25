'use client';

import AppLanguageSelect from './AppLanguageSelect';
import AppPreferenceRow from './AppPreferenceRow';
import AppThemeToggle from './AppThemeToggle';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import {
  Divider,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { axiosPut } from '@/base/api';
import { AppToast } from '@/base/components/ui';
import type { AppLocale } from '@/i18n/config';
import AppInstallButton from '@/base/components/pwa/AppInstallButton';

interface AppPreferencesProps {
  sx?: SxProps<Theme>;
  menuLayout?: boolean;
  dividers?: boolean;
  compact?: boolean;
}

const AppPreferences = ({ sx, menuLayout = false, dividers = false, compact = false }: AppPreferencesProps) => {
  const t = useTranslations('preferences');
  const locale = useLocale();
  const router = useRouter();
  const [isChangingLocale, startLocaleTransition] = useTransition();
  const [showLocaleError, setShowLocaleError] = useState(false);
  const { mode, systemMode, setMode } = useColorScheme();
  const isDarkMode = mode === 'dark' || (mode === 'system' && systemMode === 'dark');

  const languageControl = (
    <AppLanguageSelect
      value={locale as AppLocale}
      busy={isChangingLocale}
      fullLabel={menuLayout}
      onChange={(value) => {
        if (!value || value === locale) return;

        window.dispatchEvent(
          new CustomEvent('localeChange', { detail: value }),
        );

        startLocaleTransition(async () => {
          try {
            await axiosPut<{ locale: AppLocale }, { locale: AppLocale }>(
              '/preferences/locale',
              { locale: value },
            );
            router.refresh();
          } catch {
            setShowLocaleError(true);
          }
        });
      }}
    />
  );

  const themeControl = (
    <Tooltip title={isDarkMode ? t('light') : t('dark')}>
      <IconButton
        aria-label={isDarkMode ? t('light') : t('dark')}
        onClick={() => setMode(isDarkMode ? 'light' : 'dark')}
        sx={{
          width: 44,
          height: 44,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        {isDarkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );

  const themeModeControl = (
    <AppThemeToggle dark={isDarkMode} label={t('dark')} disabled={!mode}
      onChange={dark => setMode(dark ? 'dark' : 'light')} />
  );

  if (menuLayout) {
    return (
      <Stack spacing={0} sx={[{ width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
        {showLocaleError && (
          <AppToast
            open
            severity="error"
            message={t('changeError')}
            onClose={() => setShowLocaleError(false)}
          />
        )}
        <AppPreferenceRow compact={compact} icon={<TranslateRoundedIcon />} label={t('language')}>
          {languageControl}
        </AppPreferenceRow>
        {dividers && <Divider />}
        <AppPreferenceRow compact={compact} icon={<PaletteOutlinedIcon />} label={t('theme')}>
          {themeModeControl}
        </AppPreferenceRow>
        <AppInstallButton menuItem divider={dividers} compact={compact} />
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={[{ alignItems: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {showLocaleError && (
        <AppToast
          open
          severity="error"
          message={t('changeError')}
          onClose={() => setShowLocaleError(false)}
        />
      )}
      {languageControl}
      {themeControl}
      <AppInstallButton />
    </Stack>
  );
};

export default AppPreferences;
