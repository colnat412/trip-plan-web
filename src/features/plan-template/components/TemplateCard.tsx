'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { AppCard } from '@/base/components/ui';
import { TemplateSaveButton } from './TemplateSaveControls';
import type { TemplateCardData } from '../types';

const TemplateCard = ({
  template,
  compact = false,
}: {
  template: TemplateCardData;
  compact?: boolean;
}) => {
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
        color: theme.palette.common.white,
        bgcolor: 'primary.dark',
        backgroundImage: template.coverUrl
          ? `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.12)} 0%, ${alpha(theme.palette.common.black, 0.12)} 30%, ${alpha(theme.palette.common.black, 0.88)} 100%), url(${JSON.stringify(template.coverUrl)})`
          : `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderColor: 'divider',
        '&:hover, &:focus-within': { borderColor: 'primary.light' },
      })}
      contentSx={{
        display: 'flex', flexDirection: 'column', height: '100%',
        minHeight: compact ? 260 : { xs: 280, sm: 320 },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1, p: 1.25 }}>
        <Typography component="span" sx={(theme) => ({
          px: 1.25, py: 0.5, borderRadius: 'var(--app-radius-control)', fontSize: '12px', fontWeight: 700,
          color: theme.palette.common.white,
          bgcolor: alpha(theme.palette.common.black, 0.56),
        })}>
          {t('durationLabel', { days: template.durationDays })}
        </Typography>
        <Box data-template-save sx={(theme) => ({
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.common.black, 0.56),
          '& .MuiIconButton-root': { color: theme.palette.common.white },
          '& .MuiIconButton-root.Mui-disabled': { color: alpha(theme.palette.common.white, 0.5) },
        })}>
          <TemplateSaveButton id={template.id} iconOnly />
        </Box>
      </Stack>
      <Box
        component={Link}
        href={href}
        sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          flex: 1, minWidth: 0, gap: 0.75, p: 2,
          color: 'inherit', textDecoration: 'none',
          WebkitTapHighlightColor: 'transparent',
          '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.light', outlineOffset: -3 },
        }}
      >
        <Typography
          component={compact ? 'h3' : 'h2'}
          title={template.title}
          sx={{
            fontSize: compact ? '18px' : '20px', fontWeight: 700, lineHeight: 1.3,
            color: 'inherit', overflowWrap: 'anywhere',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {template.title}
        </Typography>
        <Typography variant="body2" title={template.destination} sx={{
          color: 'inherit', opacity: 0.9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {template.destination}
        </Typography>
        <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8 }}>
          {t('activityLabel', { count: template.activityCount })}
        </Typography>
      </Box>
    </AppCard>
  );
};

export default TemplateCard;
