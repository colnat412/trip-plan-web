'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppActionMenu, AppButton } from '@/base/components/ui';
import CreateTripDialog from '@/features/trip/components/CreateTripDialog';
import { useTripContext } from '@/features/trip/context/TripContext';
const QuickCreate = ({ fullWidth = false }: { fullWidth?: boolean }) => {
  const router = useRouter();
  const t = useTranslations('quickCreate');
  const { openCreateTrip } = useTripContext();
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', minWidth: 0,
        ...(fullWidth && { width: '100%', flex: '1 1 0', '& > span': { width: '100%' } }) }}>
        <AppActionMenu
          ariaLabel={t('title')}
          trigger={<AppButton intent="primary" size="medium" fullWidth={fullWidth} sx={{ minHeight: 44 }}>{t('title')}</AppButton>}
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
    </>
  );
};
export default QuickCreate;
