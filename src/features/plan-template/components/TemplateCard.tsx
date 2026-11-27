'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { tonalSurface } from '@/base/theme/surfaces';
import { AppCard } from '@/base/components/ui';
import { TemplateSaveButton } from './TemplateSaveControls';
import { safeHttpUrl } from '@/base/utils';
import type { TemplateCardData } from '../types';

interface TemplateCardProps {
  template: TemplateCardData;
  compact?: boolean;
}

const TemplateCard = ({
  template,
  compact = false,
}: TemplateCardProps) => {
  const router = useRouter();
  const t = useTranslations('planTemplate');
  const coverUrl = safeHttpUrl(template.coverUrl);
  const href = `/templates/${template.id}`;

  return (
    <AppCard
      component="article"
      onClick={(event) => {
        // The native link handles text clicks; the surrounding image also opens the template.
        if (!(event.target as HTMLElement).closest('a, button, [data-template-save]')) {
          router.push(href);
        }
      }}
      sx={(theme) => ({
        minWidth: 0,
        height: '100%',
        p: { xs: 0, sm: 0 },
        borderRadius: 'var(--app-radius-card)',
        overflow: 'hidden',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        ...tonalSurface(theme, 22),
        color: coverUrl ? theme.palette.common.white : tonalSurface(theme).color,
        backgroundColor: coverUrl
          ? alpha(theme.palette.common.black, 0.64)
          : tonalSurface(theme, 22).backgroundColor,
        backgroundImage: coverUrl ? `url(${JSON.stringify(coverUrl)})` : 'none',
        backgroundBlendMode: 'multiply',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderColor: 'divider',
        '&:hover, &:focus-within': { borderColor: 'primary.light' },
      })}
      contentSx={{
        display: 'flex', flexDirection: 'column', height: '100%',
        minHeight: compact ? 176 : { xs: 196, sm: 232 },
      }}
    >
      <Box data-template-save sx={{ display: 'flex', justifyContent: 'flex-end', p: 0.5 }}>
        <TemplateSaveButton id={template.id} iconOnly onImage={Boolean(coverUrl)} compact={compact} showCount likeCount={template.likeCount} />
      </Box>
      <Box
        component={Link}
        href={href}
        sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          flex: 1, minWidth: 0, gap: compact ? 0.5 : 0.75, p: compact ? 1.25 : 1.5,
          color: 'inherit', textDecoration: 'none',
          WebkitTapHighlightColor: 'transparent',
          '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.light', outlineOffset: -3 },
        }}
      >
        <Typography
          component={compact ? 'h3' : 'h2'}
          title={template.title}
          sx={{
            fontSize: compact ? '14px' : { xs: '14px', sm: '16px' }, fontWeight: 700, lineHeight: 1.3,
            color: 'inherit', overflowWrap: 'anywhere',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {template.title}
        </Typography>
        <Typography sx={{ fontSize: '12px', lineHeight: 1.4, color: 'inherit', overflowWrap: 'anywhere' }}>
          {t('durationNightsLabel', { days: template.durationDays, nights: Math.max(0, template.durationDays - 1) })}
        </Typography>
      </Box>
    </AppCard>
  );
};

export default TemplateCard;
