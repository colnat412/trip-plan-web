'use client';

import { Box, Typography } from '@mui/material';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppCard, AppCheckbox } from '@/base/components/ui';
import type { PolicyId } from '../constants';

interface PolicyAcceptanceCardProps {
  policy: PolicyId;
  checked: boolean;
  disabled: boolean;
  onRead: () => void;
  onChange: (checked: boolean) => void;
}

const icons = {
  terms: GavelRoundedIcon,
  content: PolicyRoundedIcon,
  privacy: ShieldRoundedIcon,
};

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
      sx={{
        p: '8px',
        borderRadius: '12px',
        borderColor: checked ? 'primary.main' : 'divider',
        bgcolor: checked ? 'action.selected' : 'background.paper',
        transition: 'border-color 150ms, background-color 150ms',
      }}
      contentSx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppCheckbox
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
                  color: 'primary.main',
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
        intent="text"
        size="small"
        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '16px' }} />}
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
