'use client';

import { Box, Stack, Typography } from '@mui/material';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useLocale, useTranslations } from 'next-intl';
import AppButton from './AppButton';
import { getGoogleMapsSearchUrl, getGoogleMapsEmbedUrl } from '@/base/utils';

export interface AppLocationMapProps {
  location: string;
  expanded?: boolean;
}

const AppLocationMap = ({ location, expanded = false }: AppLocationMapProps) => {
  const locale = useLocale();
  const t = useTranslations('locationMap');
  const query = location.trim();

  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
      {query ? (
        <>
          <Box
            component="iframe"
            key={`${locale}:${query}`}
            src={getGoogleMapsEmbedUrl(query, locale)}
            title={t('title', { location: query })}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            sx={{
              width: '100%',
              height: expanded ? { xs: '60dvh', lg: '65dvh' } : { xs: 320, lg: 400 },
              minHeight: expanded ? 360 : undefined,
              border: 0,
              borderRadius: 'var(--app-radius-card)',
              bgcolor: 'action.hover',
              colorScheme: 'light',
            }}
          />
          <Typography
            sx={{
              fontSize: '13px',
              color: 'text.secondary',
              overflowWrap: 'anywhere',
            }}
          >
            {query}
          </Typography>
          <AppButton
            component="a"
            href={getGoogleMapsSearchUrl(query)}
            target="_blank"
            rel="noopener noreferrer"
            intent="secondary"
            endIcon={<OpenInNewRoundedIcon />}
            round
          >
            {t('open')}
          </AppButton>
        </>
      ) : (
        <Box
          sx={{
            p: 4,
            bgcolor: 'action.hover',
            borderRadius: 'var(--app-radius-card)',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
            {t('empty')}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default AppLocationMap;
