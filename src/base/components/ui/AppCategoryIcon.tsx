'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { CATEGORY_CONFIG, type ActivityCategory } from '@/base/constants';

export interface AppCategoryIconProps {
  category: ActivityCategory | string;
  size?: number;
  bare?: boolean;
}

const CATEGORY_TONES = {
  ACCOMMODATION: 'primary',
  TRANSPORTATION: 'info',
  FOOD_BEVERAGE: 'warning',
  VISIT: 'success',
  SIGHTSEEING: 'info',
  SHOPPING: 'secondary',
} as const;

const AppCategoryIcon = ({ category, size = 40, bare = false }: AppCategoryIconProps) => {
  const t = useTranslations('expense.categories');
  const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.OTHER;
  const tone = CATEGORY_TONES[category as keyof typeof CATEGORY_TONES];
  const label = t(
    CATEGORY_CONFIG[category] ? (category as ActivityCategory) : 'OTHER',
  );

  return (
    <Box
      component="span"
      role="img"
      aria-label={label}
      title={label}
      sx={(theme) => {
        const palette = theme.vars?.palette ?? theme.palette;
        return {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          flexShrink: 0,
          bgcolor: 'transparent',
          color: tone ? palette[tone].dark : palette.text.secondary,
          '& .MuiSvgIcon-root': { fontSize: Math.round(size * (bare ? 0.85 : 0.55)) },
          ...theme.applyStyles('dark', {
            color: tone ? palette[tone].light : palette.text.secondary,
          }),
        };
      }}
    >
      {config.icon}
    </Box>
  );
};

export default AppCategoryIcon;
