'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { useTranslations } from 'next-intl';

import {
  AppPageContainer,
  AppPageHeader,
  AppCard,
  AppButton,
  AppTextField,
  AppNumberInput,
  AppToast,
  type AppToastSeverity,
} from '@/base/components/ui';
import { useTripContext } from '@/features/trip/context/TripContext';
import { useTripPermissions } from '@/features/trip/hooks/useTripPermissions';
import { useGenerateAiPlan } from '@/features/plan/hooks/usePlanMutation';
import DestinationAutocomplete from '@/features/trip/components/DestinationAutocomplete';

const AiPlannerView = () => {
  const router = useRouter();
  const t = useTranslations('aiPlanner');
  const { trips, activeTrip, selectTrip, openCreateTrip } = useTripContext();

  const currentTrip = activeTrip || trips[0] || null;
  const tripId = currentTrip?.id;
  const { canManage } = useTripPermissions(tripId);

  const tripDays = (() => {
    if (!currentTrip?.startDate || !currentTrip?.endDate) return 3;
    const start = new Date(currentTrip.startDate).getTime();
    const end = new Date(currentTrip.endDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 3600 * 24)) + 1;
    return diff > 0 ? diff : 1;
  })();

  const [destinationInput, setDestinationInput] = useState<string | null>(null);
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState<number | undefined>(5000000);
  const [preferences, setPreferences] = useState('');

  const destination = destinationInput ?? (currentTrip?.destination || '');
  const days = tripDays;

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AppToastSeverity;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (
    message: string,
    severity: AppToastSeverity = 'success',
  ) => {
    setToast({ open: true, message, severity });
  };

  const { generateAiPlanAsync, isPending } = useGenerateAiPlan({
    tripId: tripId || '',
  });

  // const handleAddChip = (chipText: string) => {
  //   const text = chipText.replace(/^[^\s]+\s/, '');
  //   setPreferences((prev) => {
  //     if (!prev) return text;
  //     if (prev.includes(text)) return prev;
  //     return `${prev}, ${text}`;
  //   });
  // };

  const handleGenerate = async () => {
    if (!canManage) {
      showToast(t('managerRequired'), 'error');
      return;
    }
    if (!tripId) {
      showToast('Vui lòng chọn hoặc tạo một chuyến đi trước.', 'error');
      return;
    }
    if (!destination.trim()) {
      showToast(t('destinationPlaceholder'), 'error');
      return;
    }
    if (days < 1 || days > 30) {
      showToast('Số ngày chuyến đi phải từ 1 đến 30 ngày.', 'error');
      return;
    }

    try {
      await generateAiPlanAsync({
        destination: destination.trim(),
        days: Number(days),
        budget: Number(budget || 0),
        people: Number(people || 1),
        preferences: preferences.trim(),
      });

      showToast(t('successAlert'));
      setTimeout(() => {
        router.push('/plan');
      }, 1200);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Không thể kết nối đến máy chủ AI.';
      showToast(errMsg, 'error');
    }
  };

  return (
    <AppPageContainer>
      <AppPageHeader
        icon={<AutoAwesomeRoundedIcon />}
        title={t('title')}
        badge={currentTrip?.name}
        subtitle={t('subtitle')}
        actions={
          currentTrip ? (
            <AppButton
              intent="secondary"
              size="small"
              onClick={() => router.push('/plan')}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
            >
              {t('viewPlanBtn')}
            </AppButton>
          ) : undefined
        }
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ flex: { xs: '1 1 auto', lg: 2 }, width: '100%', minWidth: 0 }}>
          <AppCard
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
            >
              {t('formTitle')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              {t('formSubtitle')}
            </Typography>

            <Stack spacing={3}>
              {trips.length > 1 && (
                <FormControl fullWidth size="medium">
                  <InputLabel id="select-trip-label">
                    {t('selectTripLabel')}
                  </InputLabel>
                  <Select
                    labelId="select-trip-label"
                    value={String(currentTrip?.id || '')}
                    label={t('selectTripLabel')}
                    onChange={(e) => {
                      selectTrip(e.target.value);
                      setDestinationInput(null);
                    }}
                  >
                    {trips.map((tr) => (
                      <MenuItem key={tr.id} value={String(tr.id)}>
                        {tr.name} {tr.destination ? `(${tr.destination})` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <DestinationAutocomplete
                value={destination}
                onChange={(val) => setDestinationInput(val)}
                disabled={isPending}
                required
                label={t('destinationLabel')}
                placeholder={t('destinationPlaceholder')}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <AppTextField
                  label={t('daysLabel')}
                  type="number"
                  value={days}
                  disabled
                  helperText={t('daysDisabledHelper')}
                  fullWidth
                />

                <AppTextField
                  label={t('peopleLabel')}
                  type="number"
                  value={people}
                  onChange={(e) =>
                    setPeople(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  disabled={isPending}
                  fullWidth
                />
              </Stack>

              <AppNumberInput
                label={t('budgetLabel')}
                value={budget}
                onValueChange={(val) => setBudget(val)}
                currencySuffix={currentTrip?.baseCurrency || 'VND'}
                disabled={isPending}
                fullWidth
              />
              {/* <Box>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontWeight: 700,
                    color: 'text.secondary',
                    mb: 1.2,
                  }}
                >
                  <LightbulbOutlinedIcon
                    sx={{ fontSize: 18, color: 'warning.main' }}
                  />
                  {t('preferencesTitle')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {PREFERENCE_CHIPS.map((chip) => (
                    <Chip
                      key={chip}
                      label={chip}
                      size="medium"
                      onClick={() => handleAddChip(chip)}
                      disabled={isPending}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '13px',
                        bgcolor: 'action.hover',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'action.selected',
                          color: 'primary.main',
                          borderColor: 'primary.main',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box> */}

              <AppTextField
                label={t('preferencesLabel')}
                placeholder={t('preferencesPlaceholder')}
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                multiline
                rows={3}
                disabled={isPending}
                fullWidth
              />

              {isPending && (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: 'action.selected',
                    border: '1.5px dashed',
                    borderColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <CircularProgress size={32} thickness={4} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: 'primary.main' }}
                    >
                      {t('generatingTitle')}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      {t('generatingSubtitle')}
                    </Typography>
                  </Box>
                </Box>
              )}

              {currentTrip && !canManage && (
                <Alert severity="info">{t('managerRequired')}</Alert>
              )}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ pt: 1, justifyContent: 'flex-end' }}
              >
                {!currentTrip && (
                  <AppButton
                    intent="secondary"
                    onClick={openCreateTrip}
                    startIcon={<FlightTakeoffRoundedIcon />}
                  >
                    {t('createTripFirst')}
                  </AppButton>
                )}

                <AppButton
                  intent="primary"
                  size="large"
                  onClick={handleGenerate}
                  disabled={
                    isPending ||
                    !destination.trim() ||
                    !currentTrip ||
                    !canManage
                  }
                  startIcon={
                    isPending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <AutoAwesomeRoundedIcon />
                    )
                  }
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '15px',
                    fontWeight: 700,
                    borderRadius: '14px',
                  }}
                >
                  {isPending ? t('generatingCta') : t('generateCta')}
                </AppButton>
              </Stack>
            </Stack>
          </AppCard>
        </Box>

        <Box sx={{ flex: { xs: '1 1 auto', lg: 1 }, width: '100%', minWidth: 0 }}>
          <AppCard variant="outlined" sx={{ p: 3, borderRadius: '16px' }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <LightbulbOutlinedIcon sx={{ color: 'warning.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('tipsTitle')}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', lineHeight: 1.7 }}
              >
                {t('tip1')}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', lineHeight: 1.7 }}
              >
                {t('tip2')}
              </Typography>
            </Stack>
          </AppCard>
        </Box>
      </Box>

      <AppToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </AppPageContainer>
  );
};

export default AiPlannerView;
