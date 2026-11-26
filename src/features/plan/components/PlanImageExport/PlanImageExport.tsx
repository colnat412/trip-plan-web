'use client';

import { contentColumn } from '@/base/theme/content-layout';
import { compactTouchTarget } from '@/base/theme/interactions';
import AppEmptyState from '@/base/components/ui/AppEmptyState';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Alert from '@/base/components/ui/AppAlert';
import { useTheme } from '@mui/material/styles';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { useLocale, useTranslations } from 'next-intl';
import { AppButton, AppLoadingState, AppPageContainer, AppBackHeader } from '@/base/components/ui';
import { downloadBlob, loadCanvasFont } from '@/base/utils';
import useTripDetail from '@/features/trip/hooks/useTripDetail';
import useTripPlan from '../../hooks/useTripPlan';
import { loadCover, renderItineraryDay } from '../../utils/render-itinerary';
import type { TripPlanOverview } from '../../types';

interface ExportImage {
  name: string;
  blob: Blob;
  url: string;
  dayNumber: number;
}

const PlanImageExport = ({ tripId }: { tripId: string }) => {
  const t = useTranslations('plan.imageExport');
  const locale = useLocale();
  const theme = useTheme();
  const {
    plan,
    error: planError,
    refetch: refetchPlan,
  } = useTripPlan({ tripId, includeActivities: true });
  const {
    trip,
    error: tripError,
    refetch: refetchTrip,
  } = useTripDetail({ tripId });
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    plan: TripPlanOverview;
    coverUrl: string | null | undefined;
    attempt: number;
    images: ExportImage[];
    error?: string;
  } | null>(null);
  const [downloadError, setDownloadError] = useState(false);
  const coverUrl = trip?.coverUrl;
  const { primary, common, warning } = theme.palette;

  useEffect(() => {
    if (
      !plan ||
      !trip ||
      String(plan.tripId) !== String(tripId) ||
      String(trip.id) !== String(tripId)
    )
      return;
    const controller = new AbortController();
    const images: ExportImage[] = [];
    const prepare = async () => {
      try {
        const fontFamily = await loadCanvasFont();
        const cover = coverUrl
          ? await loadCover(coverUrl, controller.signal)
          : null;
        for (const day of plan.days) {
          if (controller.signal.aborted) return;
          const blob = await renderItineraryDay({
            plan,
            day,
            cover,
            locale,
            fontFamily,
            colors: {
              background: primary.dark,
              foreground: common.white,
              overlay: common.black,
              accent: warning.light,
            },
            labels: {
              day: t('day', { number: day.dayNumber }),
              empty: t('emptyDay'),
              cost: t('cost'),
            },
          });
          if (controller.signal.aborted) return;
          images.push({
            blob,
            url: URL.createObjectURL(blob),
            dayNumber: day.dayNumber,
            name: `trip-${tripId}-day-${String(day.dayNumber).padStart(2, '0')}.png`,
          });
          await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
        }
        if (!controller.signal.aborted)
          setResult({ plan, coverUrl, attempt, images });
      } catch (error) {
        if (!controller.signal.aborted) {
          for (const image of images) URL.revokeObjectURL(image.url);
          const code = error instanceof Error ? error.message : '';
          setResult({
            plan,
            coverUrl,
            attempt,
            images: [],
            error:
              code === 'FONT'
                ? t('fontError')
                : code === 'COVER'
                  ? t('coverError')
                  : code === 'TOO_LONG'
                    ? t('tooLong')
                    : t('renderError'),
          });
        }
      }
    };
    void prepare();
    return () => {
      controller.abort();
      for (const image of images) URL.revokeObjectURL(image.url);
    };
  }, [
    plan,
    trip,
    tripId,
    coverUrl,
    locale,
    attempt,
    primary.dark,
    primary.main,
    common.white,
    common.black,
    warning.light,
    t,
  ]);

  const current =
    result?.plan === plan &&
    result?.coverUrl === coverUrl &&
    result?.attempt === attempt
      ? result
      : null;
  const loadError = planError || tripError;
  const images = current?.images ?? [];
  const retry = () => {
    setAttempt((value) => value + 1);
    if (loadError) {
      void refetchPlan().catch(() => undefined);
      void refetchTrip().catch(() => undefined);
    }
  };
  const downloadAll = () => {
    setDownloadError(false);
    try {
      for (const image of images) downloadBlob(image.blob, image.name);
    } catch {
      setDownloadError(true);
    }
  };

  return (
    <AppPageContainer>
      <AppBackHeader
        title={t('title')}
        titleAlign="left"
        backHref={`/plan?tripId=${encodeURIComponent(tripId)}`}
      />
      <Stack spacing={2} sx={contentColumn}>
        {loadError || current?.error ? (
          <AppErrorState status={loadError?.status} onRetry={retry} />
        ) : !current ? (
          <AppLoadingState local />
        ) : images.length === 0 ? (
          <AppEmptyState title={t('emptyPlan')} />
        ) : (
          <>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: 44, minWidth: 0 }}>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
                {t('summary', { count: images.length })}
              </Typography>
              <AppButton intent="primary" size="small" startIcon={<DownloadRoundedIcon />} onClick={downloadAll}
                sx={{
                  ...compactTouchTarget,
                  flexShrink: 0, height: 32, minHeight: 32, px: 1.25, py: 0.5, fontSize: 12,
                  '& .MuiButton-startIcon > :nth-of-type(1)': { fontSize: 16 },
                }}>
                {t('downloadAll')}
              </AppButton>
            </Stack>
            {!coverUrl && <Alert severity="info">{t('noCover')}</Alert>}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              {images.map((image) => (
                <Stack
                  key={image.name}
                  spacing={1}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: 'calc(50% - 8px)',
                      lg: 'calc(33.333% - 11px)',
                    },
                    minWidth: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={image.url}
                    alt={t('day', { number: image.dayNumber })}
                    sx={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      borderRadius: '16px',
                    }}
                  />
                </Stack>
              ))}
            </Box>
          </>
        )}
        {downloadError && <Alert severity="error">{t('downloadError')}</Alert>}
      </Stack>
    </AppPageContainer>
  );
};
export default PlanImageExport;
