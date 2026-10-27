'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import { useTranslations } from 'next-intl';
import { AppActionMenu, AppButton } from '@/base/components/ui';
import CreateTripDialog from '@/features/trip/components/CreateTripDialog';
import { useTripContext } from '@/features/trip/context/TripContext';
const QuickCreate = () => {
  const router = useRouter();
  const t = useTranslations('quickCreate');
  const { openCreateTrip } = useTripContext();
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
      <Box
        component="section"
        aria-label={t('newTrip')}
        sx={{ display: { xs: 'block', sm: 'none' }, minWidth: 0 }}
      >
        <Stack spacing={1.5}>
          <Typography component="h2" sx={{ fontSize: '14px', fontWeight: 700 }}>
            {t('newTrip')}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              alignItems: 'flex-start',
              '& > *': { flex: '1 1 0', minWidth: 0 },
            }}
          >
            <AppButton
              intent="primary"
              mobileIconLabel
              startIcon={<AddRoundedIcon />}
              onClick={openCreateTrip}
            >
              {t('manual')}
            </AppButton>
            <AppButton
              intent="secondary"
              mobileIconLabel
              startIcon={<AutoAwesomeRoundedIcon />}
              onClick={() => setAiOpen(true)}
            >
              {t('aiShort')}
            </AppButton>
            <AppButton
              intent="secondary"
              mobileIconLabel
              startIcon={<LibraryBooksRoundedIcon />}
              onClick={() => router.push('/templates')}
            >
              {t('templatesShort')}
            </AppButton>
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'flex-end' }}
      >
        <AppActionMenu
          ariaLabel={t('title')}
          trigger={<AppButton intent="primary">{t('title')}</AppButton>}
          items={[
            { id: 'ai', label: t('ai'), onClick: () => setAiOpen(true) },
            {
              id: 'templates',
              label: t('templates'),
              onClick: () => router.push('/templates'),
            },
            { id: 'manual', label: t('manual'), onClick: openCreateTrip },
          ]}
        />
      </Box>
      <CreateTripDialog
        mode="ai"
        open={aiOpen}
        onClose={() => setAiOpen(false)}
      />
    </Stack>
  );
};
export default QuickCreate;
