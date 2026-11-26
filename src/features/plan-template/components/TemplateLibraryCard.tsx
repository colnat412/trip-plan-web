'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useLocale, useTranslations } from 'next-intl';
import { AppCard } from '@/base/components/ui';
import { tonalSurface } from '@/base/theme/surfaces';
import { formatCurrency, safeHttpUrl } from '@/base/utils';
import { TemplateSaveButton } from './TemplateSaveControls';
import type { TemplateCardData } from '../types';

interface TemplateLibraryCardProps { template: TemplateCardData }

const TemplateLibraryCard = ({ template }: TemplateLibraryCardProps) => {
  const t = useTranslations('planTemplate');
  const locale = useLocale();
  const router = useRouter();
  const href = `/templates/${template.id}`;
  const coverUrl = safeHttpUrl(template.coverUrl);

  return (
    <AppCard
      component="article"
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest('a, button, [data-template-save]')) router.push(href);
      }}
      sx={(theme) => {
        const palette = theme.vars?.palette ?? theme.palette;
        return {
          p: { xs: 0, sm: 0 }, minWidth: 0, height: '100%', cursor: 'pointer',
          borderRadius: 'var(--app-radius-card)', border: 1, borderColor: 'divider',
          backgroundColor: { xs: coverUrl ? alpha(theme.palette.common.black, 0.64) : tonalSurface(theme, 22).backgroundColor, sm: palette.background.paper },
          backgroundImage: { xs: coverUrl ? `url(${JSON.stringify(coverUrl)})` : 'none', sm: 'none' },
          backgroundBlendMode: 'multiply', backgroundSize: 'cover', backgroundPosition: 'center',
          color: { xs: coverUrl ? theme.palette.common.white : tonalSurface(theme).color, sm: palette.text.primary },
          '&:hover, &:focus-within': { borderColor: 'primary.main' },
          '@media (prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)': {
            backgroundColor: { xs: coverUrl ? theme.palette.common.black : palette.background.paper, sm: palette.background.paper },
          },
        };
      }}
      contentSx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, height: '100%', minWidth: 0 }}
    >
      <Box sx={{
        order: { xs: 1, sm: 0 }, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0,
        p: 0.75, width: { sm: '100%' }, aspectRatio: { sm: '16 / 9' }, boxSizing: 'border-box',
        backgroundImage: { sm: coverUrl ? `url(${JSON.stringify(coverUrl)})` : 'none' },
        backgroundSize: 'cover', backgroundPosition: 'center', bgcolor: { sm: 'action.hover' },
      }}>
        <Box data-template-save sx={{ display: 'flex' }}>
          <TemplateSaveButton id={template.id} iconOnly onImage={Boolean(coverUrl)} />
        </Box>
        {!coverUrl && <Box sx={{ display: { xs: 'none', sm: 'flex' }, flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
          <PhotoCameraOutlinedIcon sx={{ fontSize: 28, opacity: 0.45 }} />
        </Box>}
      </Box>
      <Box component={Link} href={href} sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', order: { xs: 0, sm: 1 },
        flex: 1, minWidth: 0, minHeight: { xs: 120, sm: 'auto' }, gap: 0.5, p: { xs: 1.5, sm: 1.75 },
        color: 'inherit', textDecoration: 'none', WebkitTapHighlightColor: 'transparent',
        '&:focus-visible': { outline: '2px solid', outlineColor: 'currentColor', outlineOffset: -3, borderRadius: 'var(--app-radius-card)' },
      }}>
        <Typography component="h2" noWrap title={template.title} sx={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.3 }}>
          {template.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
          <Typography noWrap title={template.destination} sx={{ fontSize: '12px' }}>{template.destination}</Typography>
        </Box>
        <Typography sx={{ fontSize: '11px' }}>
          {t('summary', { days: template.durationDays, activities: template.activityCount })}
        </Typography>
        <Typography title={t('cost')} sx={{ fontSize: '12px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: { xs: 'inherit', sm: 'primary.main' } }}>
          {formatCurrency(template.estimatedCost, template.currency, locale)}
        </Typography>
      </Box>
    </AppCard>
  );
};

export default TemplateLibraryCard;
