'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useAppToast } from '@/base/providers/AppToastProvider';
import { AppDialog, AppButton, AppTextField } from '@/base/components/ui';
import useCopyPlanTemplate from '../hooks/useCopyPlanTemplate';
import TemplateCheckboxOption from './TemplateCheckboxOption';
import type { TemplateCardData } from '../types';
const CopyTemplateDialog = ({
  template,
  open,
  onClose,
}: {
  template: TemplateCardData;
  open: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const notify = useAppToast();
  const t = useTranslations('planTemplate');
  const [name, setName] = useState(template.title);
  const [startDate, setStartDate] = useState('');
  const [includeChecklist, setIncludeChecklist] = useState(true);
  const mutation = useCopyPlanTemplate(template.id);
  const uncertain = mutation.isOutcomeUncertain;
  const created = mutation.createdTripId;
  const submit = async () => {
    try {
      const response = await mutation.copyTemplateAsync({
        name,
        startDate,
        includeChecklist,
        expectedContentVersion: template.contentVersion,
      });
      onClose();
      notify(t('created'));
      router.push(`/plan?tripId=${encodeURIComponent(response.data.tripId)}`);
    } catch {
      // The feature hook exposes API errors and retains the retry attempt.
    }
  };
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      closeDisabled={mutation.isPending || uncertain}
      title={t('use')}
      actions={
        <AppButton
          data-dialog-action="primary"
          intent="primary"
          wrapLabel
          disabled={
            mutation.isPending || !name.trim() || !startDate || !!created
          }
          onClick={() => void submit()}
        >
          {t(uncertain ? 'retry' : 'create')}
        </AppButton>
      }
    >
      <Stack
        spacing={2}
        sx={{ flexShrink: 0, minWidth: 0, overflowWrap: 'anywhere' }}
      >
        <AppTextField
          label={t('name')}
          value={name}
          disabled={uncertain}
          onChange={(e) => setName(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
        <AppTextField
          label={t('startDate')}
          type="date"
          value={startDate}
          disabled={uncertain}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TemplateCheckboxOption
          label={t('includeChecklist')}
          checked={includeChecklist}
          disabled={uncertain}
          onChange={setIncludeChecklist}
        />
        {mutation.error && (
          <Alert severity="error">
            {mutation.error.status === 401
              ? t('loginRequired')
              : mutation.error.status === 409
                ? t('versionChanged')
                : t('copyRetry')}
          </Alert>
        )}
        {mutation.error?.status === 401 && (
          <AppButton
            component="a"
            href={`/login?returnTo=${encodeURIComponent(`/templates/${template.id}`)}`}
          >
            {t('login')}
          </AppButton>
        )}
        {mutation.error?.status === 409 && (
          <AppButton onClick={() => window.location.reload()}>
            {t('reload')}
          </AppButton>
        )}

      </Stack>
    </AppDialog>
  );
};
export default CopyTemplateDialog;
