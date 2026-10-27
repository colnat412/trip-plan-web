'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppDialog, AppButton, AppTextField } from '@/base/components/ui';
import {
  usePreviewPlanTemplate,
  usePublishPlanTemplate,
} from '../hooks/usePlanTemplateMutation';
import type { Trip } from '@/features/trip/types';
import type { PlanChecklist } from '@/features/plan/types';
import type { PublishPayload, TemplatePreview } from '../types';
import { TEMPLATE_TAGS } from '../types';
import TemplateCheckboxOption from './TemplateCheckboxOption';
import TemplateItinerary from './TemplateItinerary';
const PublishTemplateDialog = ({
  trip,
  checklists,
  open,
  onClose,
}: {
  trip: Trip;
  checklists: PlanChecklist[];
  open: boolean;
  onClose: () => void;
}) => {
  const t = useTranslations('planTemplate');
  const groupId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [payload, setPayload] = useState<PublishPayload>({
    title: trip.name,
    destination: trip.destination || '',
    description: '',
    tags: [],
    includeNotes: false,
    checklistIds: [],
  });
  const [preview, setPreview] = useState<TemplatePreview | null>(null);
  const [published, setPublished] = useState(false);
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [preview, published]);
  const update = (patch: Partial<PublishPayload>) => {
    setPayload((p) => ({ ...p, ...patch }));
    setPreview(null);
    setPublished(false);
    previewMutation.clearError();
    publishMutation.clearError();
  };
  const previewMutation = usePreviewPlanTemplate(trip.id);
  const publishMutation = usePublishPlanTemplate(trip.id);
  const busy = previewMutation.isPending || publishMutation.isPending;
  const submit = async () => {
    try {
      if (!preview) {
        const response = await previewMutation.mutateAsync(payload);
        setPreview(response.data);
      } else {
        await publishMutation.mutateAsync({
          ...payload,
          sourceFingerprint: preview.sourceFingerprint,
          expectedContentVersion: preview.contentVersion,
        });
        setPublished(true);
      }
    } catch {
      setPreview(null);
    }
  };
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      closeDisabled={busy}
      contentRef={contentRef}
      maxWidth="md"
      mobileFullScreen
      title={t('publish')}
      actions={
        <>
          {preview && !published && (
            <AppButton disabled={busy} onClick={() => setPreview(null)}>
              {t('edit')}
            </AppButton>
          )}
          {published ? (
            <AppButton intent="primary" onClick={onClose}>
              {t('done')}
            </AppButton>
          ) : (
            <AppButton
              intent="primary"
              wrapLabel
              loading={busy}
              disabled={
                busy ||
                published ||
                !payload.title.trim() ||
                !payload.destination.trim()
              }
              onClick={() => void submit()}
            >
              {t(preview ? 'confirmPublish' : 'preview')}
            </AppButton>
          )}
        </>
      }
    >
      <Stack
        spacing={2.5}
        sx={{ flexShrink: 0, minWidth: 0, overflowWrap: 'anywhere' }}
      >
        <Alert severity="info">{t('publishPrivacy')}</Alert>
        {published ? (
          <Alert severity="success">{t('published')}</Alert>
        ) : preview ? (
          <>
            <Typography component="h2" sx={{ fontWeight: 700 }}>
              {payload.title}
            </Typography>
            <Typography>{payload.destination}</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {payload.description}
            </Typography>
            <TemplateItinerary
              snapshot={preview.snapshot}
              currency={trip.baseCurrency}
            />
          </>
        ) : (
          <>
            <AppTextField
              disabled={busy}
              label={t('title')}
              value={payload.title}
              onChange={(e) => update({ title: e.target.value })}
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
            <AppTextField
              disabled={busy}
              label={t('destination')}
              value={payload.destination}
              onChange={(e) => update({ destination: e.target.value })}
              slotProps={{ htmlInput: { maxLength: 255 } }}
            />
            <AppTextField
              disabled={busy}
              multiline
              minRows={3}
              maxRows={5}
              sx={{
                '& .MuiInputBase-multiline': { p: 1.5 },
                '& .MuiInputBase-inputMultiline': { p: 0 },
              }}
              label={t('description')}
              value={payload.description}
              onChange={(e) => update({ description: e.target.value })}
              slotProps={{ htmlInput: { maxLength: 5000 } }}
            />
            <Stack
              spacing={1}
              role="group"
              aria-labelledby={`${groupId}-styles`}
            >
              <Typography
                id={`${groupId}-styles`}
                component="h3"
                sx={{ fontSize: '14px', fontWeight: 700 }}
              >
                {t('stylesLimit')}
              </Typography>
              <Box
                sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minWidth: 0 }}
              >
                {TEMPLATE_TAGS.map((tag) => (
                  <Box key={tag} sx={{ flex: '1 1 140px', minWidth: 0 }}>
                    <TemplateCheckboxOption
                      label={t(`tags.${tag}`)}
                      checked={payload.tags.includes(tag)}
                      disabled={
                        busy ||
                        (!payload.tags.includes(tag) &&
                          payload.tags.length >= 5)
                      }
                      onChange={(checked) =>
                        update({
                          tags: checked
                            ? [...payload.tags, tag]
                            : payload.tags.filter((value) => value !== tag),
                        })
                      }
                    />
                  </Box>
                ))}
              </Box>
            </Stack>
            <TemplateCheckboxOption
              label={t('includeNotes')}
              checked={payload.includeNotes}
              disabled={busy}
              onChange={(checked) => update({ includeNotes: checked })}
            />
            <Stack
              spacing={1}
              role="group"
              aria-labelledby={`${groupId}-checklist`}
            >
              <Typography
                id={`${groupId}-checklist`}
                component="h3"
                sx={{ fontSize: '14px', fontWeight: 700 }}
              >
                {t('checklist')}
              </Typography>
              {!checklists.length && (
                <Typography variant="body2" color="text.secondary">
                  {t('emptyChecklist')}
                </Typography>
              )}
              {checklists.map((item) => (
                <TemplateCheckboxOption
                  key={item.id}
                  label={item.title}
                  checked={payload.checklistIds.includes(String(item.id))}
                  disabled={busy}
                  onChange={(checked) =>
                    update({
                      checklistIds: checked
                        ? [...payload.checklistIds, String(item.id)]
                        : payload.checklistIds.filter(
                            (id) => id !== String(item.id),
                          ),
                    })
                  }
                />
              ))}
            </Stack>
          </>
        )}
        {(previewMutation.error || publishMutation.error) && (
          <Alert severity="error">
            {t(
              publishMutation.error?.status === 409
                ? 'sourceChanged'
                : 'publishError',
            )}
          </Alert>
        )}
      </Stack>
    </AppDialog>
  );
};
export default PublishTemplateDialog;
