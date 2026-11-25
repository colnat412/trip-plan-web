'use client';

import type { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import AppBrand from '@/base/components/layout/AppBrand';
import AppPreferencesMenu from '@/base/components/preferences/AppPreferencesMenu';
import AppMascot from '@/base/components/ui/AppMascot';

export default function AuthLayout({ children, showMascot = true }: {
  children: ReactNode; showMascot?: boolean;
}) {
  return <Stack component="section" sx={{
    minHeight: '100svh', width: '100%', bgcolor: 'background.paper', alignItems: 'center',
    px: { xs: 2.5, sm: 4 },
    pt: 'max(16px, env(safe-area-inset-top, 0px))',
    pb: 'max(24px, env(safe-area-inset-bottom, 0px))',
  }}>
    <Stack direction="row" sx={{ width: '100%', maxWidth: 400, alignItems: 'center', justifyContent: showMascot ? 'space-between' : 'flex-end', gap: 2 }}>
      {showMascot && <AppBrand showTag={false} />}
      <AppPreferencesMenu />
    </Stack>
    <Box sx={{
      display: 'flex', flexDirection: 'column', flex: '1 0 auto', width: '100%', maxWidth: 400,
      justifyContent: showMascot ? 'center' : 'flex-start', gap: 1.5,
      py: { xs: 2, sm: 4 },
    }}>
      {showMascot && <Box sx={{ display: 'flex', justifyContent: 'center' }}><AppMascot mood="welcome" size={88} /></Box>}
      {children}
    </Box>
  </Stack>;
}
