import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { useTranslations } from 'next-intl';
import { Box, Stack, Typography } from '@mui/material';

interface AppBrandProps {
  compactOnMobile?: boolean;
  showTag?: boolean;
}

const AppBrand = ({
  compactOnMobile = false,
  showTag = true,
}: AppBrandProps) => {
  const t = useTranslations('navigation');
  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{ alignItems: 'center', minWidth: 0 }}
    >
      <Box
        sx={{
          // The logo keeps its brand colors independently of the UI color scheme.
          bgcolor: 'color-mix(in srgb, #1E3A8A 72%, #0EA5E9)',
          color: '#FFFFFF',
          width: showTag ? 38 : 42,
          height: showTag ? 38 : 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: 'var(--app-radius-control)',
        }}
      >
        <FlightTakeoffRoundedIcon
          sx={{ fontSize: 20, transform: 'rotate(-18deg)' }}
        />
      </Box>

      <Box
        sx={{
          minWidth: 0,
          display: compactOnMobile ? { xs: 'none', sm: 'block' } : 'block',
        }}
      >
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: showTag ? '16px' : '21px',
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {t('brandName')}
        </Typography>
        {showTag ? (
          <Typography
            variant="caption"
            sx={{ color: 'primary.main', lineHeight: 1 }}
          >
            {t('brandTag')}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  );
};

export default AppBrand;
