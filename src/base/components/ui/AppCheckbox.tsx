'use client';

import { Box, Checkbox } from '@mui/material';
import type { ReactNode } from 'react';

interface AppCheckboxProps {
  label: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const AppCheckbox = ({
  label,
  checked,
  disabled,
  onChange,
}: AppCheckboxProps) => (
  <Box
    component="label"
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1,
      minHeight: '44px',
      color: 'text.primary',
      cursor: disabled ? 'default' : 'pointer',
    }}
  >
    <Checkbox
      checked={checked}
      disabled={disabled}
      onChange={(_, value) => onChange(value)}
    />
    <Box
      component="span"
      sx={{ fontSize: '13px', lineHeight: 1.7, py: '10px' }}
    >
      {label}
    </Box>
  </Box>
);

export default AppCheckbox;
