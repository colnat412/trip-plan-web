'use client';

import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useTranslations } from 'next-intl';
import { AppPopover } from '@/base/components/ui';
import AppPreferences from './AppPreferences';

const AppPreferencesMenu = () => {
  const t = useTranslations('preferences');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <Tooltip title={t('settings')}>
        <IconButton
          aria-label={t('settings')}
          aria-haspopup="dialog"
          aria-expanded={Boolean(anchorEl)}
          aria-controls={anchorEl ? 'auth-preferences' : undefined}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{ width: 44, height: 44, color: 'text.primary', bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
        >
          <TuneRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <AppPopover
        id="auth-preferences"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        label={t('settings')}
        width={360}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPopover-paper': {
            mt: 1,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            backdropFilter: 'none',
          },
        }}
      >
        <AppPreferences menuLayout dividers />
      </AppPopover>
    </>
  );
};

export default AppPreferencesMenu;
