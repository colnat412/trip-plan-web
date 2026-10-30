'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { Alert, Box, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useAppToast } from '@/base/providers/AppToastProvider';
import { AppDialog, AppButton, AppTextField, AppImageUploader, AppToast } from '@/base/components/ui';
import {
  usePreviewPlanTemplate,
  usePublishPlanTemplate,
} from '../hooks/usePlanTemplateMutation';
import type { Trip } from '@/features/trip/types';
import type { PlanChecklist } from '@/features/plan/types';
import useTripPlan from '@/features/plan/hooks/useTripPlan';
import type { PublishPayload, TemplatePreview } from '../types';
import { TEMPLATE_TAGS } from '../types';
import TemplateCheckboxOption from './TemplateCheckboxOption';
import TemplateItinerary from './TemplateItinerary';
import TemplateBanner from './TemplateBanner';
import { useTemplateCover, useTemplateCoverUpload } from '../hooks/useTemplateCover';
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
  const notify = useAppToast();
  const [validationMessage, setValidationMessage] = useState('');
  const planQuery = useTripPlan({ tripId: trip.id, enabled: open, includeActivities: false });
  const planReady = !planQuery.isLoading && !planQuery.isStale && !planQuery.error && planQuery.plan !== null;
  const activityCount = planQuery.plan?.totalActivities ?? 0;
  const activityCountValid = planReady && activityCount >= 1 && activityCount <= 1000;
  const coverQuery = useTemplateCover(trip.id, open);
  const coverUpload = useTemplateCoverUpload();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string | null>(null);
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
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [preview]);
  const close = () => {
    setValidationMessage('');
    onClose();
  };
  const update = (patch: Partial<PublishPayload>) => {
    setPayload((p) => ({ ...p, ...patch }));
    setPreview(null);
    previewMutation.clearError();
    publishMutation.clearError();
  };
  const previewMutation = usePreviewPlanTemplate(trip.id);
  const publishMutation = usePublishPlanTemplate(trip.id);
  const busy = previewMutation.isPending || publishMutation.isPending || coverUpload.isPending;
  const coverReady = !coverQuery.isStale && coverQuery.data !== null && !coverQuery.error;
  const displayedCover = payload.removeCover ? null
    : payload.coverUploadId ? uploadedCoverUrl : coverQuery.data?.data;
  const submit = async () => {
    if (!planReady) return;
    if (!activityCountValid) {
      setValidationMessage(t(activityCount === 0 ? 'publishNeedsActivities' : 'publishTooManyActivities'));
      return;
    }
    setValidationMessage('');
    try {
      if (!preview) {
        let nextPayload = payload;
        if (coverFile) {
          const uploaded = await coverUpload.uploadCover(coverFile);
          nextPayload = { ...payload, coverUploadId: uploaded.data.uploadId, removeCover: false };
          setUploadedCoverUrl(uploaded.data.url);
          setPayload(nextPayload);
          setCoverFile(null);
        }
        const response = await previewMutation.mutateAsync(nextPayload);
        setPreview(response.data);
      } else {
        await publishMutation.mutateAsync({
          ...payload,
          sourceFingerprint: preview.sourceFingerprint,
          expectedContentVersion: preview.contentVersion,
        });
        setPreview(null);
        close();
        notify(t('published'));
      }
    } catch {
      setPreview(null);
    }
  };
  return (
    <AppDialog
      open={open}
      onClose={close}
      closeDisabled={busy}
      contentRef={contentRef}
      maxWidth="md"
      mobileFullScreen
      title={t('publish')}
      actions={
        <>
          {preview && (
            <AppButton disabled={busy} onClick={() => setPreview(null)}>
              {t('edit')}
            </AppButton>
          )}
          <AppButton
            data-dialog-action="primary"
            intent="primary"
            wrapLabel
            loading={busy}
            disabled={
              busy ||
              !coverReady ||
              !planReady ||
              !payload.title.trim() ||
              !payload.destination.trim()
            }
            onClick={() => void submit()}
          >
            {t(preview ? 'confirmPublish' : 'preview')}
          </AppButton>
        </>
      }
    >
      <Stack
        spacing={2.5}
        sx={{ flexShrink: 0, minWidth: 0, overflowWrap: 'anywhere' }}
      >
        <AppToast
          open={open && Boolean(validationMessage)}
          message={validationMessage}
          severity="warning"
          onClose={() => setValidationMessage('')}
        />
        {planQuery.error ? (
            <Alert severity="error" action={
              <AppButton onClick={() => void planQuery.refetch().catch(() => undefined)}>{t('retry')}</AppButton>
            }>{t('publishPlanLoadError')}</Alert>
          ) : !planReady ? (
            <Typography role="status" variant="body2">{t('publishPlanLoading')}</Typography>
          ) : null}
        {preview ? (
          <>
            {preview.coverUrl && <TemplateBanner src={preview.coverUrl} title={payload.title} />}
            <Typography component="h2" sx={{ fontWeight: 700 }}>
              {payload.title}
            </Typography>
            <Typography>{payload.destination}</Typography>
            <TemplateItinerary
              snapshot={preview.snapshot}
              currency={trip.baseCurrency}
            />
          </>
        ) : (
          <>
            <Stack spacing={1}>
              <Typography component="h3" sx={{ fontWeight: 700, fontSize: 14 }}>{t('banner')}</Typography>
              {coverReady ? <AppImageUploader
                src={displayedCover}
                alt={t('banner')}
                variant="cover"
                disabled={busy}
                onChange={(file) => {
                  setCoverFile(file);
                  coverUpload.clearError();
                  update({ coverUploadId: undefined, removeCover: file === null });
                }}
              /> : !coverQuery.error ? <Skeleton variant="rounded" height={160} /> : (
                <Alert severity="error" action={<AppButton onClick={() => void coverQuery.refetch().catch(() => undefined)}>{t('retry')}</AppButton>}>
                  {t('bannerLoadError')}
                </Alert>
              )}
              {coverUpload.error && <Alert severity="error">{t('bannerUploadError')}</Alert>}
            </Stack>
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
