import { useTranslations } from 'next-intl';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

import AppBrand from '@/base/components/layout/AppBrand';

const LoginBrandPanel = () => {
  const t = useTranslations('login.banner');

  return (
    <Box
      component="aside"
      aria-label={t('label')}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1.15,
        flexShrink: 1,
        flexBasis: { xs: 'auto', md: 0 },
        minWidth: 0,
        minHeight: { xs: '252px', sm: '300px', md: '100svh' },
        gap: { xs: 5, md: 12 },
        p: { xs: 3, sm: 4, md: 5, lg: 7 },
        borderRadius: { xs: '0 0 12px 12px', md: '0 12px 12px 0' },
        overflow: 'hidden',
        color: 'common.white',
        bgcolor: 'primary.dark',
        backgroundImage: (theme) => {
          const dark = theme.palette.primary.dark;
          return `linear-gradient(180deg, ${alpha(dark, 0.32)} 0%, ${alpha(dark, 0.02)} 36%, ${alpha(dark, 0.6)} 63%, ${dark} 100%), url("/login-journey.svg")`;
        },
        backgroundSize: 'cover',
        backgroundPosition: { xs: 'center 42%', md: 'center' },
      }}
    >
      <Box
        sx={{
          '& .MuiTypography-root': { color: 'common.white' },
          '& .MuiTypography-caption': { opacity: 0.72 },
        }}
      >
        <AppBrand />
      </Box>

      <Stack spacing={{ xs: 1.5, md: 3 }} sx={{ maxWidth: '540px' }}>
        <Stack spacing={1.5}>
          <Typography
            component="p"
            sx={{
              display: { xs: 'none', md: 'block' },
              color: 'common.white',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            {t('eyebrow')}
          </Typography>
          <Typography
            component="h2"
            sx={{
              color: 'common.white',
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '27px', sm: '36px', md: '38px', lg: '48px' },
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: '-1px',
              textWrap: 'balance',
            }}
          >
            {t('headline')}
            <Box component="span" sx={{ display: 'block', color: 'secondary.light' }}>
              {t('headlineAccent')}
            </Box>
          </Typography>
          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              maxWidth: '410px',
              color: 'common.white',
              opacity: 0.82,
              fontSize: '15px',
              lineHeight: 1.8,
            }}
          >
            {t('description')}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          useFlexGap
          spacing={2.5}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexWrap: 'wrap',
            borderTop: 1,
            borderColor: (theme) => alpha(theme.palette.common.white, 0.22),
            pt: 2.5,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <RouteRoundedIcon sx={{ fontSize: '18px', color: 'secondary.light' }} />
            <Typography sx={{ color: 'common.white', fontSize: '12px' }}>
              {t('planning')}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <AccountBalanceWalletOutlinedIcon
              sx={{ fontSize: '18px', color: 'secondary.light' }}
            />
            <Typography sx={{ color: 'common.white', fontSize: '12px' }}>
              {t('expenses')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LoginBrandPanel;
