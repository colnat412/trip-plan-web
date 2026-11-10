'use client';

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import { useTranslations } from 'next-intl';

import {
  AppDialog,
  AppEmptyState,
  AppLinearProgress,
} from '@/base/components/ui';
import type { CreateChecklistPayload, PlanChecklist } from '../types';
import AddChecklistForm from './AddChecklistForm';
import ChecklistRow from './ChecklistRow';

export interface ChecklistDialogProps {
  open: boolean;
  onClose: () => void;
  checklists: PlanChecklist[];
  onAdd: (payload: CreateChecklistPayload) => void;
  onToggle: (item: PlanChecklist) => void;
  onDelete: (item: PlanChecklist) => void;
  isLoading?: boolean;
  readOnly?: boolean;
}

const ChecklistDialog = ({
  open,
  onClose,
  checklists,
  onAdd,
  onToggle,
  onDelete,
  isLoading = false,
  readOnly = false,
}: ChecklistDialogProps) => {
  const t = useTranslations('plan');

  const total = checklists.length;
  const completed = checklists.filter((c) => c.isCompleted).length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('checklist.title')}
      icon={<ChecklistRoundedIcon />}
      maxWidth="sm"
      showSheetHandle
    >
      <Stack spacing={2.5}>
        {total > 0 && (
          <Stack spacing={1}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                {t('checklist.completedCount', { completed, total })}
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: completed === total ? 'success.main' : 'primary.main',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {progressPercent}%
              </Typography>
            </Box>
            <AppLinearProgress
              value={progressPercent}
              height={6}
              aria-label={t('checklist.completedCount', { completed, total })}
              barColor={completed === total ? 'success.main' : 'primary.main'}
            />
          </Stack>
        )}

        {!readOnly && (
          <AddChecklistForm onSubmit={onAdd} isLoading={isLoading} />
        )}

        {total === 0 ? (
          <AppEmptyState
            title={t('checklist.emptyChecklist')}
            icon={<ChecklistRoundedIcon />}
            compact
            sx={{
              p: 2,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: '12px',
            }}
          />
        ) : (
          <Stack spacing={1}>
            {checklists.map((item) => (
              <ChecklistRow
                key={item.id}
                item={item}
                onToggle={onToggle}
                onDelete={onDelete}
                disabled={isLoading}
                readOnly={readOnly}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </AppDialog>
  );
};

export default ChecklistDialog;
