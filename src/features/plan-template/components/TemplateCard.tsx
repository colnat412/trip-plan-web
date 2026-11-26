'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { tonalSurface } from '@/base/theme/surfaces';
import { useTranslations } from 'next-intl';
import { AppCard } from '@/base/components/ui';
import { TemplateSaveButton } from './TemplateSaveControls';
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
        p: 0,
        borderRadius: 'var(--app-radius-card)',
        overflow: 'hidden',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        ...tonalSurface(theme, 22),
        color: template.coverUrl ? theme.palette.common.white : tonalSurface(theme).color,
        backgroundColor: template.coverUrl
          ? alpha(theme.palette.common.black, 0.64)
          : tonalSurface(theme, 22).backgroundColor,
        backgroundImage: template.coverUrl ? `url(${JSON.stringify(template.coverUrl)})` : 'none',
        backgroundBlendMode: 'multiply',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderColor: 'divider',
        '&:hover, &:focus-within': { borderColor: 'primary.light' },
      })}
      contentSx={{
        display: 'flex', flexDirection: 'column', height: '100%',
        minHeight: compact ? 176 : { xs: 280, sm: 320 },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center',
        gap: compact ? 0.5 : 1, p: compact ? 0.5 : 1.25, minWidth: 0 }}>
        <Typography component="span" sx={(theme) => ({
          px: compact ? 0.75 : 1.25, py: 0.5, borderRadius: 'var(--app-radius-control)', fontSize: '12px', fontWeight: 700,
          whiteSpace: 'nowrap', flexShrink: 0,
          color: theme.palette.common.white,
          bgcolor: alpha(theme.palette.common.black, 0.56),
        })}>
          {t('durationLabel', { days: template.durationDays })}
        </Typography>
        <Box data-template-save sx={{ display: 'flex', flexShrink: 0 }}>
          <TemplateSaveButton id={template.id} iconOnly onImage compact={compact} />
        </Box>
      </Stack>
      <Box
        component={Link}
        href={href}
        sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          flex: 1, minWidth: 0, gap: compact ? 0.5 : 0.75, p: compact ? 1.25 : 2,
          color: 'inherit', textDecoration: 'none',
          WebkitTapHighlightColor: 'transparent',
          '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.light', outlineOffset: -3 },
        }}
      >
        <Typography
          component={compact ? 'h3' : 'h2'}
          title={template.title}
          sx={{
            fontSize: compact ? '14px' : '20px', fontWeight: 700, lineHeight: 1.3,
            minHeight: compact ? '2.6em' : undefined,
            color: 'inherit', overflowWrap: 'anywhere',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {template.title}
        </Typography>
        <Typography variant="body2" title={template.destination} sx={{
          color: 'inherit', opacity: 0.9, overflow: 'hidden',
          ...(compact ? {
            fontSize: '12px', lineHeight: 1.4, minHeight: '1.4em',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          } : { textOverflow: 'ellipsis', whiteSpace: 'nowrap' }),
        }}>
          {template.destination}
        </Typography>
        <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, whiteSpace: 'nowrap' }}>
          {t('activityLabel', { count: template.activityCount })}
        </Typography>
      </Box>
    </AppCard>
  );
};

export default TemplateCard;
