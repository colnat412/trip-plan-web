'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { Box, MenuItem, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppDatePicker,
  AppDialog,
  AppImageUploader,
  AppTextArea,
  AppTextField,
  AppToast,
} from '@/base/components/ui';
import PopularDestinations from './PopularDestinations';
import DestinationAutocomplete from './DestinationAutocomplete';
import AppJourneySteps from '@/base/components/ui/AppJourneySteps';
import AppMascot from '@/base/components/ui/AppMascot';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { formatDate } from '@/base/utils';
import { useTripContext } from '../context/TripContext';
import { useCreateTrip } from '../hooks/useTripMutation';

interface CreateTripDialogProps {
  mode?: 'manual' | 'ai';
  open: boolean;
  onClose: () => void;
}

interface TripFormErrors {
  name?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
}

const CURRENCY_OPTIONS = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
  // { value: 'EUR', label: 'EUR' },
  // { value: 'JPY', label: 'JPY' },
  // { value: 'THB', label: 'THB' },
];

const CreateTripDialog = ({
  open,
  onClose,
  mode = 'manual',
}: CreateTripDialogProps) => {
  const router = useRouter();
  const t = useTranslations('trip');
  const j = useTranslations('journey');
  const [step, setStep] = useState(0);
  const { refetchTrips, selectTrip } = useTripContext();
  const { createMutation } = useCreateTrip();

  const [coverFile, setCoverFile] = useState<File | null | undefined>();
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('VND');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState<TripFormErrors>({});
  const [successToastOpen, setSuccessToastOpen] = useState(false);

  const resetForm = () => {
    setStep(0);
    setCoverFile(undefined);
    setName('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setBaseCurrency('VND');
    setDescription('');
    setFormErrors({});
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (createMutation.isPending) return;

    if (step < 2) {
      const errors: TripFormErrors = {};
      if (step === 0 && !destination.trim()) errors.destination = t('destinationRequired');
      if (step === 1) {
        if (!startDate) errors.startDate = t('startDateRequired');
        if (!endDate) errors.endDate = t('endDateRequired');
        else if (startDate && endDate < startDate) errors.endDate = t('endDateInvalid');
      }
      setFormErrors(errors);
      if (!Object.keys(errors).length) {
        if (step === 0 && !name.trim()) setName(destination.trim());
        setStep(step + 1);
      }
      return;
    }

    const nextErrors: TripFormErrors = {};
    const trimmedName = name.trim();
    const trimmedDestination = destination.trim();

    if (!trimmedName) {
      nextErrors.name = t('nameRequired');
    }

    if (!trimmedDestination) {
      nextErrors.destination = t('destinationRequired');
    }

    if (!startDate) {
      nextErrors.startDate = t('startDateRequired');
    }

    if (!endDate) {
      nextErrors.endDate = t('endDateRequired');
    } else if (startDate && endDate < startDate) {
      nextErrors.endDate = t('endDateInvalid');
    }

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    createMutation.mutate(
      {
        coverFile,
        name: trimmedName,
        destination: trimmedDestination,
        startDate,
        endDate,
        baseCurrency,
        description: description.trim() || undefined,
      },
      {
        onSuccess: async (response) => {
          setSuccessToastOpen(true);
          resetForm();
          onClose();
          if (response?.data?.id) {
            selectTrip(response.data.id);
            router.push(`/plan?tripId=${encodeURIComponent(String(response.data.id))}${mode === 'ai' ? '&ai=1' : ''}`);
          }
          await refetchTrips('created').catch(() => undefined);
        },
      },
    );
  };

  return (
    <>
      <AppToast
        open={successToastOpen}
        severity="success"
        message={t('createSuccess')}
        onClose={() => setSuccessToastOpen(false)}
      />

      <AppToast
        open={Boolean(createMutation.error)}
        severity="error"
        message={createMutation.error?.message ?? ''}
        onClose={createMutation.clearError}
      />

      <AppDialog
        mobilePresentation="screen"
        protectChanges
        hasUnsavedChanges={Boolean(coverFile || name || destination || startDate || endDate || description || baseCurrency !== 'VND')}
        open={open}
        onClose={handleClose}
        closeDisabled={createMutation.isPending}
        title={j(step === 0 ? 'destination' : step === 1 ? 'dates' : 'finish')}
        icon={<FlightTakeoffRoundedIcon />}
        maxWidth="sm"
        actions={
          <>
            <AppButton
              data-dialog-action={step === 0 ? 'cancel' : undefined}
              intent="secondary"
              size="medium"
              onClick={step === 0 ? handleClose : () => setStep(step - 1)}
              disabled={createMutation.isPending}
            >
              {step === 0 ? t('cancelButton') : j('back')}
            </AppButton>
            <AppButton
              data-dialog-action="primary"
              type="submit"
              form="create-trip-form"
              intent="primary"
              size="medium"
              loading={createMutation.isPending}
            >
              {step < 2 ? j('next') : t('createButton')}
            </AppButton>
          </>
        }
      >
        <Box
          component="form"
          id="create-trip-form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          <AppJourneySteps labels={[t('destination'), t('dateRangeLabel'), j('review')]} active={step} />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', minWidth: 0 }}>
            <AppMascot size={80} />
            <Typography component="h2" sx={{ fontSize: 20, fontWeight: 600, overflowWrap: 'anywhere' }}>
              {step === 0 ? j('destination') : destination}
            </Typography>
          </Stack>
          {step === 0 && <Stack spacing={2.5}>
            <DestinationAutocomplete
              required
              value={destination}
              error={Boolean(formErrors.destination)}
              helperText={formErrors.destination}
              disabled={createMutation.isPending}
              onChange={(val) => {
                setDestination(val);
                setFormErrors((prev) => ({ ...prev, destination: undefined }));
                createMutation.clearError();
              }}
            />

            <Typography variant="body2" sx={{ fontWeight: 700 }}>{j('popular')}</Typography>
            <PopularDestinations value={destination} disabled={createMutation.isPending}
              onChange={(place) => { setDestination(place); setFormErrors({}); createMutation.clearError(); }} />
          </Stack>}
          {step === 1 && <Stack spacing={2.5}>
            <AppDatePicker
              inline
              mode="range"
              label={t('dateRangeLabel')}
              required
              value={[startDate, endDate]}
              disabled={createMutation.isPending}
              error={Boolean(formErrors.startDate || formErrors.endDate)}
              helperText={formErrors.startDate || formErrors.endDate}
              onChange={([start, end]) => {
                setStartDate(start);
                setEndDate(end);
                setFormErrors((previous) => ({ ...previous, startDate: undefined, endDate: undefined }));
                createMutation.clearError();
              }}
            />

          </Stack>}
          {step === 2 && <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary">{formatDate(startDate)} – {formatDate(endDate)}</Typography>
            <AppTextField
              label={t('name')}
              placeholder={t('namePlaceholder')}
              required
              value={name}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
              disabled={createMutation.isPending}
              // slotProps={{
              //   inputLabel: { shrink: true },
              // }}
              onChange={(e) => {
                setName(e.target.value);
                setFormErrors((prev) => ({ ...prev, name: undefined }));
                createMutation.clearError();
              }}
            />

            <AppTextField
              select
              label={t('baseCurrency')}
              value={baseCurrency}
              disabled={createMutation.isPending}
              onChange={(e) => setBaseCurrency(e.target.value)}
            >
              {CURRENCY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </AppTextField>

            <Accordion disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>{j('details')}</AccordionSummary>
              <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <AppImageUploader
                  file={coverFile}
                  alt={t('coverImage')}
                  variant="cover"
                  disabled={createMutation.isPending}
                  onChange={setCoverFile}
                />
                <AppTextArea
                  label={t('description')}
                  placeholder={t('descriptionPlaceholder')}
                  value={description}
                  disabled={createMutation.isPending}
                  minRows={3}
                  maxRows={5}
                  // slotProps={{
                  //   inputLabel: { shrink: true },
                  // }}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </AccordionDetails>
            </Accordion>
          </Stack>}
        </Box>
      </AppDialog>
    </>
  );
};

export default CreateTripDialog;
