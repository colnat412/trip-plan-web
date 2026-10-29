'use client';
import Link from 'next/link';
import { TemplateSaveButton } from './TemplateSaveControls';
import { Box, Stack, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import TemplateBanner from './TemplateBanner';
import { useLocale, useTranslations } from 'next-intl';
import { AppCard } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { TemplateCardData } from '../types';
import { TEMPLATE_TAGS } from '../types';
const TemplateCard = ({
  template,
  compact = false,
  featured = false,
}: {
  template: TemplateCardData;
  compact?: boolean;
  featured?: boolean;
}) => {
  const locale = useLocale();
  const t = useTranslations('planTemplate');
  return (
    <AppCard
      component="article"
      sx={{ minWidth: 0, height: '100%', overflowWrap: 'anywhere', borderRadius: '20px', p: 2 }}
      contentSx={{ height: '100%' }}
    >
      <Box sx={{
        display: 'grid', gap: 2, height: '100%', minWidth: 0,
        gridTemplateRows: featured ? undefined : 'auto minmax(0, 1fr)',
        gridTemplateColumns: featured ? { xs: 'minmax(0, 1fr)', sm: 'minmax(160px, 30%) minmax(0, 1fr)' } : 'minmax(0, 1fr)',
      }}>
        <TemplateBanner src={template.coverUrl} title={template.title} compact={compact} featured={featured} />
        <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Typography
          component={compact ? 'h3' : 'h2'}
          title={template.title}
          sx={{
            fontWeight: 700,
            minWidth: 0,
            flex: 1,
            pt: 1,
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
        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0, alignItems: 'center' }}>
          <TemplateSaveButton id={template.id} iconOnly />
          <Tooltip title={t('view')}>
            <IconButton
              component={Link}
              href={`/templates/${template.id}`}
              aria-label={t('view')}
              color="primary"
              sx={{ width: 44, height: 44 }}
            >
              <VisibilityRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        </Stack>
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

        </Stack>
      </Box>
    </AppCard>
  );
};
export default TemplateCard;
