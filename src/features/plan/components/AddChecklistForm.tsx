'use client';

import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppSelect,
  AppTextField,
  type AppSelectOption,
} from '@/base/components/ui';
import type { ChecklistCategory, CreateChecklistPayload } from '../types';

export interface AddChecklistFormProps {
  onSubmit: (payload: CreateChecklistPayload) => void;
  isLoading?: boolean;
}

const AddChecklistForm = ({
  onSubmit,
  isLoading = false,
}: AddChecklistFormProps) => {
  const t = useTranslations('plan');
  const tCat = useTranslations('plan.checklistCategories');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ChecklistCategory>('DOCUMENTS');

  const categoryOptions: AppSelectOption[] = useMemo(
    () => [
      { value: 'DOCUMENTS', label: tCat('DOCUMENTS') },
      { value: 'CLOTHING', label: tCat('CLOTHING') },
      { value: 'ELECTRONICS', label: tCat('ELECTRONICS') },
      { value: 'MEDICAL', label: tCat('MEDICAL') },
      { value: 'TASKS', label: tCat('TASKS') },
      { value: 'OTHER', label: tCat('OTHER') },
    ],
    [tCat],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !title.trim()) return;

    onSubmit({
      title: title.trim(),
      category,
    });
    setTitle('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        width: '100%',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <AppTextField
          label={t('checklist.itemLabel')}
          placeholder={t('checklist.inputPlaceholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          size="small"
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AppSelect
            searchable
            label={t('checklist.categorySelect')}
            value={category}
            onChange={(e) => setCategory(e.target.value as ChecklistCategory)}
            options={categoryOptions}
            disabled={isLoading}
            size="small"
            fullWidth
          />
        </Box>

        <AppButton
          type="submit"
          intent="primary"
          size="small"
          startIcon={<AddRoundedIcon />}
          disabled={!title.trim()}
          loading={isLoading}
          sx={{ flexShrink: 0, minHeight: 44, px: 2 }}
        >
          {t('checklist.addBtn')}
        </AppButton>
      </Box>
    </Box>
  );
};

export default AddChecklistForm;
