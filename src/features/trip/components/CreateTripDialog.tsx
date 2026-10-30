'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppDialog,
  AppTextArea,
  AppTextField,
  AppToast,
} from '@/base/components/ui';
import DestinationAutocomplete from './DestinationAutocomplete';
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
  const { refetchTrips, selectTrip } = useTripContext();
  const { createMutation } = useCreateTrip();

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('VND');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState<TripFormErrors>({});
  const [successToastOpen, setSuccessToastOpen] = useState(false);

  const resetForm = () => {
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
            if (mode === 'ai')
              router.push(
                `/plan?tripId=${encodeURIComponent(String(response.data.id))}&ai=1`,
              );
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
        open={open}
        onClose={handleClose}
        closeDisabled={createMutation.isPending}
        mobileFullScreen
        title={t('createTitle')}
        description={t('createDescription')}
        icon={<FlightTakeoffRoundedIcon />}
        maxWidth="sm"
        actions={
          <>
            <AppButton
              data-dialog-action="cancel"
              intent="secondary"
              size="medium"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              {t('cancelButton')}
            </AppButton>
            <AppButton
              data-dialog-action="primary"
              type="submit"
              form="create-trip-form"
              intent="primary"
              size="medium"
              loading={createMutation.isPending}
            >
              {t('createButton')}
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

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <AppTextField
              label={t('startDate')}
              type="date"
              required
              value={startDate}
              error={Boolean(formErrors.startDate)}
              helperText={formErrors.startDate}
              disabled={createMutation.isPending}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              onChange={(e) => {
                setStartDate(e.target.value);
                setFormErrors((prev) => ({ ...prev, startDate: undefined }));
                createMutation.clearError();
              }}
            />

            <AppTextField
              label={t('endDate')}
              type="date"
              required
              value={endDate}
              error={Boolean(formErrors.endDate)}
              helperText={formErrors.endDate}
              disabled={createMutation.isPending}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              onChange={(e) => {
                setEndDate(e.target.value);
                setFormErrors((prev) => ({ ...prev, endDate: undefined }));
                createMutation.clearError();
              }}
            />
          </Stack>

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
        </Box>
      </AppDialog>
    </>
  );
};

export default CreateTripDialog;
