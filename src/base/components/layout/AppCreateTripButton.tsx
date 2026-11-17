'use client';

import { IconButton, Tooltip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';
import { useTripContext } from '@/features/trip/context/TripContext';

const AppCreateTripButton = () => {
  const t = useTranslations('navigation');
  const { openCreateTrip } = useTripContext();
  return <Tooltip title={t('createTrip')}><IconButton aria-label={t('createTrip')} onClick={openCreateTrip}
    sx={(theme) => ({ width: 56, height: 56, flexShrink: 0, color: 'primary.contrastText',
      background: `linear-gradient(135deg, ${(theme.vars?.palette ?? theme.palette).primary.main}, ${(theme.vars?.palette ?? theme.palette).primary.light})`,
      boxShadow: 'none', '&:hover': { filter: 'brightness(1.06)' },
      '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 3 } })}><AddRoundedIcon sx={{ fontSize: 28 }} /></IconButton></Tooltip>;
};
export default AppCreateTripButton;
