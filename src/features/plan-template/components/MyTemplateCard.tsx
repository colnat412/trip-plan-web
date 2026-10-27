'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Chip, IconButton, Stack, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useTranslations } from 'next-intl';
import { AppActionMenu, AppButton, AppCard } from '@/base/components/ui';
import type { TemplateCardData } from '../types';

interface MyTemplateCardProps {
  template: TemplateCardData;
  isUnpublishing: boolean;
  onUnpublish: (id: string) => void;
}

const MyTemplateCard = ({
  template,
  isUnpublishing,
  onUnpublish,
}: MyTemplateCardProps) => {
  const t = useTranslations('planTemplate');
  const router = useRouter();
  const published = template.status === 'PUBLISHED';
  const previewTextSx = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  } as const;
  return (
    <AppCard
      component="article"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: '16px',
        minWidth: 0,
        overflowWrap: 'anywhere',
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          useFlexGap
          spacing={1}
          sx={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="h2"
              title={template.title}
              sx={{ fontSize: '17px', fontWeight: 700, ...previewTextSx }}
            >
              {template.title}
            </Typography>
            <Chip
              size="small"
              variant={published ? 'outlined' : 'filled'}
              color={published ? 'success' : 'default'}
              label={t(published ? 'statusPublished' : 'statusUnpublished')}
              sx={(theme) => ({
                alignSelf: 'flex-start',
                height: 'auto',
                minHeight: 24,
                maxWidth: '100%',
                fontSize: '12px',
                '& .MuiChip-label': {
                  py: 0.25,
                  whiteSpace: 'normal',
                  overflowWrap: 'anywhere',
                },
                ...theme.applyStyles(
                  'dark',
                  published
                    ? {
                        color: (theme.vars?.palette ?? theme.palette).success
                          .light,
                        borderColor: (theme.vars?.palette ?? theme.palette)
                          .success.light,
                      }
                    : {},
                ),
              })}
            />
          </Stack>
          {published && (
            <AppActionMenu
              ariaLabel={t('templateActions', { title: template.title })}
              trigger={
                <IconButton
                  aria-label={t('templateActions', { title: template.title })}
                  aria-haspopup="menu"
                  sx={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    color: 'text.secondary',
                  }}
                >
                  <MoreHorizRoundedIcon />
                </IconButton>
              }
              items={[
                {
                  id: 'view',
                  label: t('view'),
                  icon: <VisibilityOutlinedIcon fontSize="small" />,
                  onClick: () => router.push(`/templates/${template.id}`),
                },
                {
                  id: 'unpublish',
                  label: t('unpublish'),
                  icon: <VisibilityOffOutlinedIcon fontSize="small" />,
                  disabled: isUnpublishing,
                  danger: true,
                  onClick: () => onUnpublish(template.id),
                },
              ]}
            />
          )}
        </Stack>
        {template.destination && (
          <Typography
            variant="body2"
            color="text.secondary"
            title={template.destination}
            sx={previewTextSx}
          >
            {template.destination}
          </Typography>
        )}
        <Stack
          direction="row"
          useFlexGap
          spacing={1.5}
          sx={{ flexWrap: 'wrap' }}
        >
          <Typography variant="caption" color="text.secondary">
            {t('summary', {
              days: template.durationDays,
              activities: template.activityCount,
            })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('myUsage', { count: template.usageCount })}
          </Typography>
        </Stack>
        {template.sourceTripId && (
          <AppButton
            component={Link}
            href={`/plan?tripId=${encodeURIComponent(template.sourceTripId)}&publish=1`}
            intent="secondary"
            size="small"
            startIcon={<EditRoundedIcon />}
            wrapLabel
            sx={{ alignSelf: 'flex-start', minHeight: 44, maxWidth: '100%' }}
          >
            {t(published ? 'edit' : 'republish')}
          </AppButton>
        )}
      </Stack>
    </AppCard>
  );
};
export default MyTemplateCard;
