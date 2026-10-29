import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Comfortaa } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

import { AppShell } from '@/base/components/layout';
import { AUTH_COOKIE_NAMES, PUBLIC_AUTH_PATHS, PUBLIC_PATHS } from '@/base/constants';
import AppThemeProvider from '@/base/providers/AppThemProvider';
import AppInstallListener from '@/base/components/pwa/AppInstallListener';

import './globals.css';

const comfortaa = Comfortaa({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-comfortaa',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Trip Plan',
  appleWebApp: {
    title: 'Trip Plan',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
};

export const viewport: import('next').Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// add path name to hide sidebar here
const sidebarDisabledPaths: readonly string[] = [
  ...PUBLIC_AUTH_PATHS,
  ...PUBLIC_PATHS,
  '/print',
];

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const hasSession = AUTH_COOKIE_NAMES.some((name) => Boolean(cookieStore.get(name)?.value));

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={comfortaa.variable}
    >
      <body>
        <InitColorSchemeScript attribute="data" defaultMode="light" />
        <AppInstallListener />
        <NextIntlClientProvider>
          <AppThemeProvider>
            <AppShell sidebarDisabledPaths={sidebarDisabledPaths} hasSession={hasSession}>
              {children}
            </AppShell>
          </AppThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
