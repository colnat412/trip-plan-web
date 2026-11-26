'use client';

import { selectedSurface } from '@/base/theme/surfaces';

import { Box, Typography } from '@mui/material';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppCard, AppCheckbox } from '@/base/components/ui';
import type { PolicyId } from '../constants';



const icons = {
  terms: GavelRoundedIcon,
  content: PolicyRoundedIcon,
  privacy: ShieldRoundedIcon,
};

interface PolicyAcceptanceCardProps {
  policy: PolicyId;
  checked: boolean;
  disabled: boolean;
  onRead: () => void;
  onChange: (checked: boolean) => void;
}

const PolicyAcceptanceCard = ({
  policy,
  checked,
  disabled,
  onRead,
  onChange,
}: PolicyAcceptanceCardProps) => {
  const t = useTranslations('legal');
  const Icon = icons[policy];

  return (
    <AppCard
      variant="outlined"
      sx={(theme) => ({
        p: '8px',
        borderRadius: 'var(--app-radius-control)',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'border-color 150ms, background-color 150ms',
        ...(checked && !disabled && selectedSurface(theme)),
      })}
      contentSx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppCheckbox
          inheritColor={checked && !disabled}
          checked={checked}
          disabled={disabled}
          label={
            <Box
              component="span"
              sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Icon
                aria-hidden
                sx={{
                  fontSize: '20px',
                  color: checked && !disabled ? 'inherit' : 'primary.main',
                  flexShrink: 0,
                  display: { xs: 'none', sm: 'block' },
                }}
              />
              <Typography
                component="span"
                sx={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.6 }}
              >
                {t(`documents.${policy}.accept`)}
              </Typography>
            </Box>
          }
          onChange={onChange}
        />
      </Box>
      <AppButton
        intent={checked && !disabled ? "secondary" : "text"}
        size="small"
        endIcon={<ChevronRightRoundedIcon sx={{ fontSize: '16px' }} />}
        aria-label={t('read', { name: t(`documents.${policy}.title`) })}
        onClick={onRead}
        sx={{
          px: '10px',
          minWidth: 'auto',
          minHeight: '44px',
          fontSize: '12px',
          flexShrink: 0,
        }}
      >
        {t('readShort')}
      </AppButton>
    </AppCard>
  );
};

export default PolicyAcceptanceCard;
