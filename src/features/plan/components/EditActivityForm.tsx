'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppImageUploader,
  AppToast,
  AppTimePicker,
  AppNumberInput,
  AppSelect,
  AppTextArea,
  AppTextField,
  type AppSelectOption,
} from '@/base/components/ui';
import { useUploadFile } from '@/base/hooks';
import { getCategorySelectOptions, normalizeTripCategory } from '@/base/constants';
import type {
  ActivityCategory,
  ActivityStatus,
  PlanActivity,
  UpdateActivityPayload,
} from '../types';
import LocationAutocompleteInput from './LocationAutocompleteInput';

export interface EditActivityFormProps {
  activity: PlanActivity;
  tripCurrency?: string;
  isLoading?: boolean;
  onSubmit: (payload: UpdateActivityPayload) => void | Promise<unknown>;
  onCancel: () => void;
  onSavingChange?: (saving: boolean) => void;
}

const EditActivityForm = ({
  activity,
  tripCurrency = 'VND',
  isLoading = false,
  onSubmit,
  onCancel,
  onSavingChange,
}: EditActivityFormProps) => {
  const tToast = useTranslations('plan.toasts');
  const tCat = useTranslations('plan.categories');
  const tStatus = useTranslations('plan.statuses');
  const tDialog = useTranslations('plan.dialog');

  const upload = useUploadFile();
  const [imageFile, setImageFile] = useState<File | null | undefined>();
  const [imageUpload, setImageUpload] = useState<{ file: File; id: string }>();
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const busy = isLoading || saving;
  const inFlight = useRef(false);
  const [title, setTitle] = useState(activity.title || '');
  const [category, setCategory] = useState<ActivityCategory>(
    normalizeTripCategory(activity.category || 'FOOD_BEVERAGE'),
  );
  const [status, setStatus] = useState<ActivityStatus>(
    activity.status || 'PLANNED',
  );
  const [startTime, setStartTime] = useState(
    activity.startTime ? activity.startTime.slice(0, 5) : '',
  );
  const [endTime, setEndTime] = useState(
    activity.endTime ? activity.endTime.slice(0, 5) : '',
  );
  const [location, setLocation] = useState(activity.location || '');
  const [estimatedCost, setEstimatedCost] = useState<number | undefined>(
    activity.estimatedCost > 0 ? activity.estimatedCost : undefined,
  );
  const [note, setNote] = useState(activity.note || '');
  const [titleError, setTitleError] = useState('');
  const [timeError, setTimeError] = useState('');

  const categoryOptions: AppSelectOption[] = useMemo(
    () => getCategorySelectOptions(tCat),
    [tCat],
  );

  const statusOptions: AppSelectOption[] = useMemo(
    () => [
      { value: 'PLANNED', label: tStatus('PLANNED') },
      { value: 'IN_PROGRESS', label: tStatus('IN_PROGRESS') },
      { value: 'COMPLETED', label: tStatus('COMPLETED') },
      { value: 'SKIPPED', label: tStatus('SKIPPED') },
    ],
    [tStatus],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || inFlight.current) return;
    if (!title.trim()) {
      setTitleError(tDialog('titleRequired'));
      return;
    }
    setTitleError('');

    if (startTime && endTime && endTime < startTime) {
      setTimeError(tDialog('timeOrderInvalid'));
      return;
    }
    setTimeError('');

    inFlight.current = true;
    setSaving(true);
    onSavingChange?.(true);
    setImageError(false);
    try {
      let imageUploadId = imageFile && imageUpload?.file === imageFile ? imageUpload.id : undefined;
      if (imageFile && !imageUploadId) {
        const response = await upload.mutateAsync({ file: imageFile, purpose: 'ACTIVITY_IMAGE' });
        imageUploadId = response.data.uploadId;
        setImageUpload({ file: imageFile, id: imageUploadId });
      }
      await onSubmit({
        imageUploadId,
        removeImage: imageFile === null,
        title: title.trim(),
        category,
        status,
        startTime: startTime.trim() || undefined,
        endTime: endTime.trim() || undefined,
        location: location.trim() || undefined,
        estimatedCost: estimatedCost && estimatedCost > 0 ? estimatedCost : 0,
        note: note.trim() || undefined,
      });
    } catch {
      setImageError(true);
    } finally {
      inFlight.current = false;
      setSaving(false);
      onSavingChange?.(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2.5}>
        <AppImageUploader
          src={activity.imageUrl}
          file={imageFile}
          alt={activity.title}
          variant="cover"
          disabled={busy}
          onChange={setImageFile}
        />
        <AppToast
          open={imageError}
          message={tToast('error')}
          severity="error"
          onClose={() => setImageError(false)}
        />
        <AppTextField
          disabled={busy}
          label={tDialog('titleLabel')}
          placeholder={tDialog('titlePlaceholder')}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          error={!!titleError}
          helperText={titleError}
          fullWidth
          required
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppSelect
              disabled={busy}
              label={tDialog('categoryLabel')}
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              options={categoryOptions}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppSelect
              disabled={busy}
              label={tDialog('statusLabel')}
              value={status}
              onChange={(e) => setStatus(e.target.value as ActivityStatus)}
              options={statusOptions}
              fullWidth
            />
          </Box>
        </Box>

        <AppTimePicker
          mode="range"
          label={tDialog('timeRangeLabel')}
          value={[startTime, endTime]}
          disabled={busy}
          error={!!timeError}
          helperText={timeError}
          onChange={([start, end]) => {
            setStartTime(start);
            setEndTime(end);
            if (timeError) setTimeError('');
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <LocationAutocompleteInput
              disabled={busy}
              label={tDialog('locationLabel')}
              placeholder={tDialog('locationPlaceholder')}
              value={location}
              onChange={(newVal) => setLocation(newVal)}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppNumberInput
              disabled={busy}
              label={tDialog('estimatedCostLabel')}
              value={estimatedCost}
              onValueChange={(val) => setEstimatedCost(val)}
              currencySuffix={tripCurrency}
              fullWidth
            />
          </Box>
        </Box>

        <AppTextArea
          disabled={busy}
          label={tDialog('noteLabel')}
          placeholder={tDialog('notePlaceholder')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          fullWidth
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            pt: 1,
          }}
        >
          <AppButton data-dialog-action="cancel" intent="secondary" onClick={onCancel} disabled={busy}>
            {tDialog('cancelBtn')}
          </AppButton>
          <AppButton data-dialog-action="primary" type="submit" intent="primary" loading={busy}>
            {tDialog('saveBtn')}
          </AppButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditActivityForm;
