'use client';

import { Chip, type ChipProps } from '@mui/material';
import { useTranslations } from 'next-intl';
import { type TripCategory, CATEGORY_CONFIG } from '@/base/constants';

export type CategoryType = TripCategory | string;
export { CATEGORY_CONFIG };

export interface AppCategoryChipProps extends Omit<ChipProps, 'color'> {
  category: CategoryType;
}

type KnownCategory =
  | 'ACCOMMODATION'
  | 'TRANSPORTATION'
  | 'FOOD_BEVERAGE'
  | 'SIGHTSEEING'
  | 'SHOPPING'
  | 'OTHER';

const AppCategoryChip = ({
  category,
  size = 'small',
  sx,
  label: customLabel,
  ...chipProps
}: AppCategoryChipProps) => {
  const t = useTranslations('expense.categories');
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.OTHER;
  const label =
    customLabel ||
    (CATEGORY_CONFIG[category] ? t(category as KnownCategory) : t('OTHER'));

  return (
    <Chip
      {...chipProps}
      size={size}
      icon={config.icon}
      label={label}
      sx={[
        (theme) => ({
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 600,
          fontSize: '12px',
          borderRadius: 'var(--app-radius-badge)',
          maxWidth: '100%',
          height: 'auto',
          minHeight: 24,
          '& .MuiChip-label': { whiteSpace: 'normal', overflowWrap: 'anywhere', py: 0.25 },
          '& .MuiChip-icon': {
            color: 'inherit',
          },
          ...theme.applyStyles('dark', {
            backgroundColor: `color-mix(in srgb, ${config.color} 18%, ${(theme.vars?.palette ?? theme.palette).background.paper})`,
            color: `color-mix(in srgb, ${config.color} 35%, ${(theme.vars?.palette ?? theme.palette).text.primary})`,
          }),
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
};

export default AppCategoryChip;
