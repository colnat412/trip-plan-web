'use client';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import {
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
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
}

const AppPreferences = ({ sx, menuLayout = false }: AppPreferencesProps) => {
  const t = useTranslations('preferences');
  const locale = useLocale();
  const router = useRouter();
  const [isChangingLocale, startLocaleTransition] = useTransition();
  const [showLocaleError, setShowLocaleError] = useState(false);
  const { mode, setMode } = useColorScheme();
  const isDarkMode = mode === 'dark';

  const languageControl = (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={locale}
      disabled={isChangingLocale}
      aria-label={t('language')}
      onChange={(_event, value: AppLocale | null) => {
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
      sx={{
        bgcolor: menuLayout ? 'transparent' : 'background.paper',
        gap: menuLayout ? 0.5 : 0,
        '& .MuiToggleButton-root': {
          minWidth: 44,
          minHeight: 44,
          px: 0.75,
          border: menuLayout ? 0 : undefined,
          borderColor: menuLayout ? 'transparent' : 'divider',
          borderRadius: menuLayout ? '10px !important' : undefined,
          color: 'text.secondary',
          fontSize: menuLayout ? '18px' : '20px',
          fontWeight: 800,
          '&.Mui-selected': {
            bgcolor: menuLayout ? 'action.selected' : 'primary.main',
            color: menuLayout ? 'text.primary' : 'primary.contrastText',
            '&:hover': {
              bgcolor: menuLayout ? 'action.selected' : 'primary.main',
            },
          },
        },
      }}
    >
      <ToggleButton
        value="vi"
        title={t('vietnamese')}
        aria-label={t('vietnamese')}
      >
        🇻🇳
      </ToggleButton>
      <ToggleButton
        value="en"
        title={t('english')}
        aria-label={t('english')}
      >
        🇬🇧
      </ToggleButton>
    </ToggleButtonGroup>
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
    <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
      {[
        {
          value: 'light' as const,
          label: t('light'),
          icon: <LightModeOutlinedIcon sx={{ fontSize: '19px' }} />,
        },
        {
          value: 'dark' as const,
          label: t('dark'),
          icon: <DarkModeOutlinedIcon sx={{ fontSize: '19px' }} />,
        },
        {
          value: 'system' as const,
          label: t('system'),
          icon: <DesktopWindowsOutlinedIcon sx={{ fontSize: '18px' }} />,
        },
      ].map((option) => {
        const selected = (mode ?? 'system') === option.value;

        return (
          <Tooltip key={option.value} title={option.label}>
            <IconButton
              aria-label={option.label}
              aria-pressed={selected}
              onClick={() => setMode(option.value)}
              sx={{
                width: 44,
                height: 44,
                border: 1,
                borderColor: selected ? 'divider' : 'transparent',
                borderRadius: '10px',
                bgcolor: selected ? 'action.selected' : 'transparent',
                color: selected ? 'text.primary' : 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                },
              }}
            >
              {option.icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );

  if (menuLayout) {
    return (
      <Stack spacing={0} sx={{ width: '100%' }}>
        {showLocaleError && (
          <AppToast
            open
            severity="error"
            message={t('changeError')}
            onClose={() => setShowLocaleError(false)}
          />
        )}
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ minHeight: 56, alignItems: 'center', px: 1 }}
        >
          <TranslateRoundedIcon
            sx={{ flexShrink: 0, color: 'text.secondary', fontSize: '18px' }}
          />
          <Typography
            sx={{ flex: 1, color: 'text.primary', fontSize: '13px', fontWeight: 700 }}
          >
            {t('language')}
          </Typography>
          {languageControl}
        </Stack>
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ minHeight: 56, alignItems: 'center', px: 1 }}
        >
          <PaletteOutlinedIcon
            sx={{ flexShrink: 0, color: 'text.secondary', fontSize: '18px' }}
          />
          <Typography
            sx={{ flex: 1, color: 'text.primary', fontSize: '13px', fontWeight: 700 }}
          >
            {t('theme')}
          </Typography>
          {themeModeControl}
        </Stack>
        <AppInstallButton menuItem />
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
