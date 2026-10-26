'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { CATEGORY_CONFIG, type TripCategory } from '@/base/constants';

export interface AppCategoryIconProps {
  category: TripCategory | string;
}

const CATEGORY_TONES = {
  ACCOMMODATION: 'primary',
  TRANSPORTATION: 'info',
  FOOD_BEVERAGE: 'warning',
  SIGHTSEEING: 'success',
  SHOPPING: 'secondary',
  ENTERTAINMENT: 'primary',
} as const;

const AppCategoryIcon = ({ category }: AppCategoryIconProps) => {
  const t = useTranslations('expense.categories');
  const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.OTHER;
  const tone = CATEGORY_TONES[category as keyof typeof CATEGORY_TONES];
  const label = t(
    CATEGORY_CONFIG[category] ? (category as TripCategory) : 'OTHER',
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
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: '50%',
          bgcolor: tone
            ? `color-mix(in srgb, ${palette[tone].main} 10%, ${palette.background.paper})`
            : palette.action.selected,
          color: tone ? palette[tone].dark : palette.text.secondary,
          '& .MuiSvgIcon-root': { fontSize: '22px' },
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
