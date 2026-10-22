'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppPopover, AppTextField } from '@/base/components/ui';
import { formatDateRange } from '@/base/utils';
import TripSwitcherResults from '@/features/trip/components/TripSwitcherResults';
import { useTripContext } from '@/features/trip/context/TripContext';

interface AppTripSwitcherProps {
  actions?: ReactNode;
}

const AppTripSwitcher = ({ actions }: AppTripSwitcherProps) => {
  const t = useTranslations('navigation');
  const {
    activeTrip,
    selectTrip,
    openCreateTrip,
    isLoading,
    error,
    refetchTrips,
  } = useTripContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const popoverId = useId();
  const searchInput = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const handleClose = () => {
    setAnchorEl(null);
    setSearch('');
  };
  const handleCreate = () => {
    handleClose();
    openCreateTrip();
  };

  if (isLoading && !activeTrip) {
    return (
      <Skeleton
        variant="rounded"
        width="100%"
        height={56}
        sx={{ borderRadius: '12px' }}
      />
    );
  }
  if (!activeTrip) {
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexWrap: 'wrap' }}
      >
        {/* <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
          {error ? t('tripLoadError') : t('noTrip')}
        </Typography> */}
        <AppButton
          size="small"
          intent="text"
          onClick={
            error
              ? () => {
                  void refetchTrips();
                }
              : openCreateTrip
          }
          sx={{ minHeight: 44 }}
        >
          {error ? t('retry') : t('createTrip')}
        </AppButton>
      </Stack>
    );
  }
  return (
    <>
      <AppButton
        intent="text"
        size="small"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        aria-label={t('switchTrip', { name: activeTrip.name })}
        sx={{
          minWidth: 0,
          width: '100%',
          maxWidth: '100%',
          minHeight: 56,
          px: 1.5,
          color: 'text.primary',
          bgcolor: 'action.hover',
          border: 1,
          borderColor: open ? 'primary.main' : 'divider',
          '&.Mui-focusVisible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
          justifyContent: 'flex-start',
          borderRadius: '12px',
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ width: '100%', minWidth: 0, alignItems: 'center' }}
        >
          <Avatar
            src={activeTrip.coverUrl ?? undefined}
            alt={activeTrip.name}
            variant="rounded"
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'action.selected',
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            <FlightTakeoffRoundedIcon sx={{ fontSize: '20px' }} />
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
            <Typography
              noWrap
              sx={{ fontWeight: 700, fontSize: '15px', color: 'text.primary' }}
            >
              {activeTrip.name}
            </Typography>
            <Typography
              noWrap
              sx={{ fontSize: '11px', color: 'text.secondary' }}
            >
              <Box
                component="span"
                sx={{ display: { xs: 'inline', sm: 'none' } }}
              >
                {formatDateRange(
                  activeTrip.startDate,
                  activeTrip.endDate,
                  'DD/MM',
                )}
              </Box>
              <Box
                component="span"
                sx={{ display: { xs: 'none', sm: 'inline' } }}
              >
                {formatDateRange(
                  activeTrip.startDate,
                  activeTrip.endDate,
                  'DD/MM/YYYY',
                )}
              </Box>
            </Typography>
          </Box>
          <ExpandMoreRoundedIcon
            sx={{ flexShrink: 0, color: 'text.secondary', fontSize: '20px' }}
          />
        </Stack>
      </AppButton>
      <AppPopover
        id={popoverId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        label={t('chooseTrip')}
        title={t('chooseTrip')}
        width={400}
        header={
          <AppTextField
            autoFocus
            inputRef={searchInput}
            variantType="search"
            placeholder={t('searchTrips')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              htmlInput: { 'aria-label': t('searchTrips') },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ fontSize: '18px', color: 'text.secondary' }}
                    />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label={t('clearSearch')}
                      onClick={() => {
                        setSearch('');
                        searchInput.current?.focus();
                      }}
                      sx={{ width: 32, height: 32 }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: '18px' }} />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 44,
                minHeight: 44,
                borderRadius: '10px',
                bgcolor: 'action.hover',
                fontSize: '13px',
              },
            }}
          />
        }
        actions={
          <Stack spacing={1}>
            {actions && <Box onClick={handleClose}>{actions}</Box>}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <AppButton
                size="small"
                intent="primary"
                startIcon={<AddRoundedIcon />}
                onClick={handleCreate}
                sx={{ minHeight: 44 }}
              >
                {t('createTrip')}
              </AppButton>
              <AppButton
                size="small"
                intent="text"
                component={Link}
                href="/trips"
                onClick={handleClose}
                sx={{ minHeight: 44 }}
              >
                {t('allTrips')}
              </AppButton>
            </Stack>
          </Stack>
        }
      >
        {open && (
          <TripSwitcherResults
            search={search}
            selectedTripId={activeTrip.id}
            onSelect={(trip) => {
              selectTrip(trip.id);
              handleClose();
            }}
          />
        )}
      </AppPopover>
    </>
  );
};
export default AppTripSwitcher;
