'use client';

import AppSegmentedControl from '../ui/AppSegmentedControl';
import AppPreferenceRow from './AppPreferenceRow';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import {
  Box,
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
}

const AppPreferences = ({ sx, menuLayout = false, dividers = false }: AppPreferencesProps) => {
  const t = useTranslations('preferences');
  const locale = useLocale();
  const router = useRouter();
  const [isChangingLocale, startLocaleTransition] = useTransition();
  const [showLocaleError, setShowLocaleError] = useState(false);
  const { mode, setMode } = useColorScheme();
  const isDarkMode = mode === 'dark';

  const languageControl = (
    <AppSegmentedControl<AppLocale>
      label={t('language')}
      value={locale as AppLocale}
      disabled={isChangingLocale}
      options={[
        { value: 'vi', label: <Box component="span" sx={{ fontSize: 18 }}>🇻🇳</Box>, ariaLabel: t('vietnamese') },
        { value: 'en', label: <Box component="span" sx={{ fontSize: 18 }}>🇬🇧</Box>, ariaLabel: t('english') },
      ]}
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
      sx={{ width: 104, flexShrink: 0 }}
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
    <AppSegmentedControl<'light' | 'dark' | 'system'>
      label={t('theme')}
      value={mode ?? 'system'}
      onChange={setMode}
      options={[
        { value: 'light', label: <LightModeOutlinedIcon sx={{ fontSize: 18 }} />, ariaLabel: t('light') },
        { value: 'dark', label: <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />, ariaLabel: t('dark') },
        { value: 'system', label: <DesktopWindowsOutlinedIcon sx={{ fontSize: 18 }} />, ariaLabel: t('system') },
      ]}
      sx={{ width: 150, flexShrink: 0 }}
    />
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
        <AppPreferenceRow icon={<TranslateRoundedIcon />} label={t('language')}>
          {languageControl}
        </AppPreferenceRow>
        {dividers && <Divider />}
        <AppPreferenceRow icon={<PaletteOutlinedIcon />} label={t('theme')}>
          {themeModeControl}
        </AppPreferenceRow>
        <AppInstallButton menuItem divider={dividers} />
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
