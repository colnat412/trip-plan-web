'use client';

import { AppLoadingIndicator, AppButton, AppPopover, AppTextField } from '@/base/components/ui';

import { useId, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useTranslations } from 'next-intl';

import TripSwitcherResults from '@/features/trip/components/TripSwitcherResults';
import { useTripContext } from '@/features/trip/context/TripContext';

interface AppTripSwitcherProps {
  actions?: ReactNode;
}

const AppTripSwitcher = ({ actions }: AppTripSwitcherProps) => {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const router = useRouter();
  const isTripsPage = pathname === '/trips' || pathname.startsWith('/trips/');
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
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
    setSearch('');
  };
  const handleCreate = () => {
    handleClose();
    openCreateTrip();
  };

  if (isLoading && !activeTrip) {
    return <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 48 }}><AppLoadingIndicator /></Box>;
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
          minHeight: 48,
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
          borderRadius: 'var(--app-radius-control)',
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
              width: 32,
              height: 32,
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
        width={360}
        contentMaxHeight={224}
        contentRef={setScrollRoot}
        header={
          <AppTextField
            autoFocus
            inputRef={searchInput}
            size="small"
            placeholder={t('searchTrips')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              htmlInput: { 'aria-label': t('searchTrips') },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ fontSize: '16px', color: 'text.secondary' }}
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
                      <CloseRoundedIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 36,
                minHeight: 36,
                px: 1,
                borderRadius: 'var(--app-radius-control)',
                bgcolor: 'action.hover',
                fontSize: '13px',
              },
              '& .MuiOutlinedInput-input': {
                py: 0,
                px: 0,
                fontSize: '13px',
                lineHeight: '20px',
              },
            }}
          />
        }
        actions={
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'stretch' }}>
              {actions && (
                <Box onClick={handleClose} sx={{ display: 'flex', flex: '0 0 auto', minWidth: 0 }}>
                  {actions}
                </Box>
              )}
              <AppButton
                size="small"
                intent="primary"
                startIcon={<AddRoundedIcon />}
                onClick={handleCreate}
                wrapLabel
                sx={{ flex: '1 1 auto', minWidth: 0, minHeight: 44, borderRadius: 'var(--app-radius-control)', px: 1 }}
              >
                {t('createTrip')}
              </AppButton>
            </Stack>
            {!isTripsPage && (
              <AppButton
                component={Link}
                href="/trips"
                intent="text"
                size="small"
                fullWidth
                wrapLabel
                onClick={handleClose}
                endIcon={<ChevronRightRoundedIcon sx={{ fontSize: '18px' }} />}
                sx={{ minHeight: 44, borderRadius: 'var(--app-radius-control)', px: 1.5, justifyContent: 'space-between', textAlign: 'left' }}
              >
                {t('allTrips')}
              </AppButton>
            )}
          </Stack>
        }
      >
        {open && (
          <TripSwitcherResults
            search={search}
            scrollRoot={scrollRoot}
            selectedTripId={activeTrip.id}
            onSelect={(trip) => {
              selectTrip(trip.id);
              handleClose();
              router.push(`/plan?tripId=${encodeURIComponent(String(trip.id))}`);
            }}
          />
        )}
      </AppPopover>
    </>
  );
};
export default AppTripSwitcher;
