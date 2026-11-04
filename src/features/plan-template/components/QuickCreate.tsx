'use client';
import { Box } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';
import { AppButton } from '@/base/components/ui';
import { useTripContext } from '@/features/trip/context/TripContext';
const QuickCreate = ({ fullWidth = false }: { fullWidth?: boolean }) => {
  const t = useTranslations('quickCreate');
  const { openCreateTrip } = useTripContext();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        minWidth: 0,
        ...(fullWidth && { width: '100%', flex: '1 1 0' }),
      }}
    >
      <AppButton
        intent="primary"
        size="medium"
        fullWidth={fullWidth}
        startIcon={<AddRoundedIcon />}
        onClick={openCreateTrip}
        sx={{ minHeight: 44 }}
      >
        {t('createTrip')}
      </AppButton>
    </Box>
  );
};
export default QuickCreate;
