'use client';

import { useId, useState } from 'react';
import { Box, ButtonBase, MenuItem, MenuList, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { useTranslations } from 'next-intl';
import { AppDialog, AppPopover } from '@/base/components/ui';
import { defaultLocale, locales, localeDisplay, type AppLocale } from '@/i18n/config';

export default function AppLanguageSelect({ value, busy = false, fullLabel = false, onChange }: {
  value: AppLocale; busy?: boolean; fullLabel?: boolean; onChange: (value: AppLocale) => void;
}) {
  const t = useTranslations('preferences');
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const id = useId();
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchor);
  const current = localeDisplay[value] ?? localeDisplay[defaultLocale];
  const close = () => setAnchor(null);
  const options = <MenuList autoFocusItem={open} variant="selectedMenu" aria-label={t('language')} sx={{ p: 0 }}>
    {locales.map(locale => {
      const language = localeDisplay[locale];
      const selected = locale === value;
      return <MenuItem key={locale} role="menuitemradio" aria-checked={selected} selected={selected}
        disabled={busy} onClick={() => {
          if (busy) return;
          if (!selected) onChange(locale);
          close();
        }} sx={{ minHeight: '48px !important', gap: 1.25, px: 1.5, borderRadius: 'var(--app-radius-small)' }}>
        <Box component="span" aria-hidden="true" sx={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{language.flag}</Box>
        <Typography component="span" lang={locale} sx={{ flex: 1, minWidth: 0, fontSize: 14 }}>{language.name}</Typography>
        {selected && <CheckRoundedIcon sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />}
      </MenuItem>;
    })}
  </MenuList>;

  return <>
    <ButtonBase type="button" disabled={busy} aria-busy={busy || undefined}
      aria-label={`${t('language')}: ${current.name}`} aria-haspopup="dialog" aria-expanded={open}
      aria-controls={open ? id : undefined} onClick={event => setAnchor(event.currentTarget)}
      sx={{ minHeight: 44, maxWidth: 164, flexShrink: 0, borderRadius: 'var(--app-radius-control)',
        '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        '&.Mui-disabled': { opacity: 0.55 },
      }}>
      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minHeight: 36, minWidth: 0,
        px: 1.25, border: 1, borderColor: 'divider', borderRadius: 'var(--app-radius-control)', bgcolor: 'background.paper',
        '&:hover': { bgcolor: 'action.hover' },
      }}>
        <Box component="span" aria-hidden="true" sx={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{current.flag}</Box>
        <Typography component="span" noWrap lang={fullLabel ? value : undefined} sx={{ fontSize: 13, fontWeight: 500, minWidth: 0 }}>
          {fullLabel ? current.name : value.toUpperCase()}
        </Typography>
        <ExpandMoreRoundedIcon sx={{ fontSize: 16, flexShrink: 0, color: 'text.secondary' }} />
      </Box>
    </ButtonBase>
    {mobile ? <AppDialog open={open} onClose={close} title={t('language')} maxWidth="xs" mobilePresentation="sheet"
      titleAlign="left" showSheetHandle paperSx={{ '& .MuiDialogContent-root': { pt: 1 } }}>
      <Box id={id}>{options}</Box>
    </AppDialog> : <AppPopover id={id} open={open} anchorEl={anchor} onClose={close} label={t('language')}
      width={240} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      {options}
    </AppPopover>}
  </>;
}
