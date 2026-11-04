'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { Box, DialogActions, MenuItem, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppDatePicker,
  AppImageUploader,
  AppTextArea,
  AppTextField,
  AppToast,
} from '@/base/components/ui';
import DestinationAutocomplete from './DestinationAutocomplete';
import { useUpdateTrip } from '../hooks/useTripMutation';
import type { Trip, TripStatus } from '../types';
import { TRIP_STATUS_OPTIONS, TRIP_STATUS_PRESENTATION } from '../constants/trip-status';

interface EditTripFormProps {
  trip: Trip;
  onClose: () => void;
  onSuccess?: (updatedTrip: Trip) => void;
  onBusyChange: (busy: boolean) => void;
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
];

const EditTripForm = ({
  trip,
  onClose,
  onSuccess,
  onBusyChange,
}: EditTripFormProps) => {
  const t = useTranslations('trip');

  const [coverFile, setCoverFile] = useState<File | null | undefined>();
  const [name, setName] = useState(trip.name);
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [baseCurrency, setBaseCurrency] = useState(trip.baseCurrency || 'VND');
  const [status, setStatus] = useState<TripStatus>(trip.status || 'DRAFT');
  const [description, setDescription] = useState(trip.description || '');
  const [errors, setErrors] = useState<TripFormErrors>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  const { updateTrip, isPending } = useUpdateTrip({
    tripId: trip.id,
  });

  useEffect(() => {
    onBusyChange(isPending);
    return () => onBusyChange(false);
  }, [isPending, onBusyChange]);

  const validate = (): boolean => {
    const newErrors: TripFormErrors = {};

    if (!name.trim()) {
      newErrors.name = t('nameRequired');
    }

    if (!destination.trim()) {
      newErrors.destination = t('destinationRequired');
    }

    if (!startDate) {
      newErrors.startDate = t('startDateRequired');
    }

    if (!endDate) {
      newErrors.endDate = t('endDateRequired');
    } else if (startDate && endDate < startDate) {
      newErrors.endDate = t('endDateInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending || !validate()) {
      return;
    }

    updateTrip(
      {
        coverFile,
        name: name.trim(),
        destination: destination.trim(),
        description: description.trim() ? description.trim() : undefined,
        startDate,
        endDate,
        baseCurrency,
        status,
      },
      {
        onSuccess: (response) => {
          onSuccess?.(response.data);
          onClose();
        },
        onError: (err) => {
          setToastMessage(err.message || t('updateFailed'));
        },
      },
    );
  };

  return (
    <>
      <AppToast
        open={Boolean(toastMessage)}
        severity="error"
        message={toastMessage || ''}
        onClose={() => setToastMessage(null)}
      />

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
      >
        <Box
          component="fieldset"
          disabled={isPending}
          sx={{
            border: 0,
            p: 0,
            m: 0,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <AppImageUploader
            src={trip.coverUrl}
            alt={t('coverImage')}
            fallback={trip.name.slice(0, 1)}
            variant="cover"
            disabled={isPending}
            onChange={setCoverFile}
          />
          <AppTextField
            disabled={isPending}
            label={t('name')}
            placeholder={t('namePlaceholder')}
            required
            value={name}
            error={Boolean(errors.name)}
            helperText={errors.name}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
          />

          <DestinationAutocomplete
            disabled={isPending}
            required
            value={destination}
            error={Boolean(errors.destination)}
            helperText={errors.destination}
            onChange={(val) => {
              setDestination(val);
              if (errors.destination) {
                setErrors((prev) => ({ ...prev, destination: undefined }));
              }
            }}
          />

          <AppDatePicker
            mode="range"
            label={t('dateRangeLabel')}
            required
            value={[startDate, endDate]}
            disabled={isPending}
            error={Boolean(errors.startDate || errors.endDate)}
            helperText={errors.startDate || errors.endDate}
            onChange={([start, end]) => {
              setStartDate(start);
              setEndDate(end);
              setErrors((previous) => ({ ...previous, startDate: undefined, endDate: undefined }));
            }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <AppTextField
                disabled={isPending}
                select
                label={t('baseCurrency')}
                value={baseCurrency}
                slotProps={{ inputLabel: { shrink: true } }}
                onChange={(e) => setBaseCurrency(e.target.value)}
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </AppTextField>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <AppTextField
                disabled={isPending}
                select
                label={t('statusLabel')}
                value={TRIP_STATUS_PRESENTATION[status].value}
                slotProps={{ inputLabel: { shrink: true } }}
                onChange={(e) => setStatus(e.target.value as TripStatus)}
              >
                {TRIP_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </MenuItem>
                ))}
              </AppTextField>
            </Box>
          </Stack>

          <AppTextArea
            disabled={isPending}
            label={t('description')}
            placeholder={t('descriptionPlaceholder')}
            value={description}
            minRows={3}
            maxRows={5}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <DialogActions sx={{ px: 0, pt: 1, gap: 1.5 }}>
          <AppButton
            data-dialog-action="cancel"
            intent="secondary"
            size="medium"
            disabled={isPending}
            onClick={onClose}
          >
            {t('cancelButton')}
          </AppButton>
          <AppButton
            data-dialog-action="primary"
            type="submit"
            intent="primary"
            size="medium"
            loading={isPending}
          >
            {t('saveChanges')}
          </AppButton>
        </DialogActions>
      </Box>
    </>
  );
};

export default EditTripForm;
