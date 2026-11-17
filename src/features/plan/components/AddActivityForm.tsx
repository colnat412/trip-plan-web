'use client';

import useDialogDraft from '@/base/hooks/use-dialog-draft';

import React, { useMemo, useRef, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack } from '@mui/material';
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
import { ACTIVITY_CATEGORIES, getCategorySelectOptions } from '@/base/constants';
import type { ActivityCategory, CreateActivityPayload } from '../types';
import LocationAutocompleteInput from './LocationAutocompleteInput';
import ActivityDiscovery from './ActivityDiscovery';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

export interface AddActivityFormProps {
  destination?: string;
  discovering: boolean;
  onDiscoveringChange: (discovering: boolean) => void;
  tripCurrency?: string;
  isLoading?: boolean;
  onSubmit: (payload: CreateActivityPayload) => void | Promise<unknown>;
  onSavingChange?: (saving: boolean) => void;
  onCancel: () => void;
}

const AddActivityForm = ({
  destination = '',
  discovering,
  onDiscoveringChange: setDiscovering,
  tripCurrency = 'VND',
  isLoading = false,
  onSubmit,
  onCancel,
  onSavingChange,
}: AddActivityFormProps) => {
  const upload = useUploadFile();
  const j = useTranslations('journey');
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [imageFile, setImageFile] = useState<File | null | undefined>();
  const [imageUpload, setImageUpload] = useState<{ file: File; id: string }>();
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const inFlight = useRef(false);
  const busy = isLoading || saving;
  const tToast = useTranslations('plan.toasts');
  const tCat = useTranslations('plan.categories');
  const tDialog = useTranslations('plan.dialog');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('FOOD_BEVERAGE');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number | undefined>(
    undefined,
  );
  const [note, setNote] = useState('');
  const [titleError, setTitleError] = useState('');
  const [timeError, setTimeError] = useState('');

  useDialogDraft(() => ({
    title, category, startTime, endTime, location, estimatedCost, note,
    image: imageFile ? [imageFile.name, imageFile.size, imageFile.lastModified] : undefined,
  }));

  const categoryOptions: AppSelectOption[] = useMemo(
    () => getCategorySelectOptions(tCat, ACTIVITY_CATEGORIES),
    [tCat],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || inFlight.current || discovering) return;
    if (!title.trim()) {
      setTitleError(tDialog('titleRequired'));
      return;
    }
    setTitleError('');

    if (startTime && endTime && endTime < startTime) {
      setDetailsExpanded(true);
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
        title: title.trim(),
        category,
        startTime: startTime.trim() || undefined,
        endTime: endTime.trim() || undefined,
        location: location.trim() || undefined,
        estimatedCost: estimatedCost && estimatedCost > 0 ? estimatedCost : undefined,
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
        {discovering ? <ActivityDiscovery destination={destination} category={category} disabled={busy}
          onCategoryChange={setCategory} onManual={() => setDiscovering(false)}
          onChoose={(place) => { setTitle(place.mainText); setLocation(place.description || place.mainText); setTitleError(''); setDiscovering(false); }} /> : <>
        <AppToast open={imageError} message={tToast('error')} severity="error" onClose={() => setImageError(false)} />
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
          autoFocus
        />

        <LocationAutocompleteInput
          disabled={busy}
          label={tDialog('locationLabel')}
          placeholder={tDialog('locationPlaceholder')}
          value={location}
          onChange={(newVal) => setLocation(newVal)}
          fullWidth
        />

        <Accordion expanded={detailsExpanded} onChange={(_, expanded) => setDetailsExpanded(expanded)} disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>{j('optional')}</AccordionSummary>
          <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
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
                <AppNumberInput
                  emphasis="primary"
                  disabled={busy}
                  label={tDialog('estimatedCostLabel')}
                  value={estimatedCost}
                  onValueChange={(val) => setEstimatedCost(val)}
                  currencySuffix={tripCurrency}
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

            <AppTextArea
              disabled={busy}
              label={tDialog('noteLabel')}
              placeholder={tDialog('notePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              fullWidth
            />

            <AppImageUploader file={imageFile} alt={title} variant="cover" disabled={busy} onChange={setImageFile} />
          </AccordionDetails>
        </Accordion>
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
        </>}
      </Stack>
    </Box>
  );
};

export default AddActivityForm;
