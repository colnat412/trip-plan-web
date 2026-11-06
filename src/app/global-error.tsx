'use client';

import { useSyncExternalStore } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Box } from '@mui/material';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import AppThemeProvider from '@/base/providers/AppThemProvider';
import { AppButton, AppErrorState } from '@/base/components/ui';
import vi from '../../messages/vi.json';
import en from '../../messages/en.json';

const subscribe = () => () => undefined;
const getLocale = (): 'en' | 'vi' =>
  document.documentElement.lang === 'en' ? 'en' : 'vi';
const getServerLocale = (): 'vi' => 'vi';

const GlobalErrorPage = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const locale = useSyncExternalStore(subscribe, getLocale, getServerLocale);
  const messages = locale === 'en' ? en.errors : vi.errors;
  return (
    <html lang={locale}>
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        <InitColorSchemeScript attribute="data" defaultMode="light" />
        <NextIntlClientProvider locale={locale} messages={{ errors: messages }}>
          <AppThemeProvider>
            <Box
              sx={{
                minHeight: '100dvh',
                display: 'grid',
                placeItems: 'center',
                p: 2,
                bgcolor: 'background.default',
              }}
            >
              <AppErrorState
                variant="unexpected"
                onRetry={reset}
                sx={{ maxWidth: 560 }}
                action={
                  <AppButton href="/overview" intent="secondary">
                    {messages.home}
                  </AppButton>
                }
              />
            </Box>
          </AppThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default GlobalErrorPage;
