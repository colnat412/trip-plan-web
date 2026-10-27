'use client';
import Link from 'next/link';
import { Stack, Typography, Chip, Box } from '@mui/material';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import { useLocale, useTranslations } from 'next-intl';
import { AppCard, AppButton } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { TemplateCardData } from '../types';
import { TEMPLATE_TAGS } from '../types';
const TemplateCard = ({
  template,
  compact = false,
}: {
  template: TemplateCardData;
  compact?: boolean;
}) => {
  const locale = useLocale();
  const t = useTranslations('planTemplate');
  return (
    <AppCard
      component="article"
      sx={{ minWidth: 0, height: '100%', overflowWrap: 'anywhere' }}
    >
      <Stack spacing={compact ? 1 : 1.5}>
        {!compact && (
          <Box
            sx={{
              bgcolor: 'action.hover',
              borderRadius: '12px',
              p: 3,
              display: 'flex',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <RouteRoundedIcon sx={{ fontSize: 48 }} />
          </Box>
        )}
        <Typography
          component={compact ? 'h3' : 'h2'}
          title={template.title}
          sx={{
            fontWeight: 700,
            ...(compact
              ? {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }
              : {}),
          }}
        >
          {template.title}
        </Typography>
        <Typography
          variant="body2"
          title={template.destination}
          sx={
            compact
              ? {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }
              : undefined
          }
        >
          {template.destination}
        </Typography>
        <Typography variant="body2">
          {t('summary', {
            days: template.durationDays,
            activities: template.activityCount,
          })}
        </Typography>
        {!compact && (
          <Typography variant="body2">
            {t('cost')}:{' '}
            {formatCurrency(template.estimatedCost, template.currency, locale)}
          </Typography>
        )}
        {!compact && (
          <Typography variant="caption">
            {t('author', {
              name: template.authorName,
              count: template.usageCount,
            })}
          </Typography>
        )}
        {!compact && (
          <Stack
            direction="row"
            useFlexGap
            spacing={0.5}
            sx={{ flexWrap: 'wrap' }}
          >
            {TEMPLATE_TAGS.filter((tag) =>
              template.tags.split(',').includes(tag),
            ).map((tag) => (
              <Chip size="small" key={tag} label={t(`tags.${tag}`)} />
            ))}
          </Stack>
        )}
        <AppButton
          component={Link}
          href={`/templates/${template.id}`}
          intent="secondary"
        >
          {t('view')}
        </AppButton>
      </Stack>
    </AppCard>
  );
};
export default TemplateCard;
