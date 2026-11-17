'use client';

import { selectedSurface } from '@/base/theme/surfaces';

import { Box, Checkbox, Typography } from '@mui/material';

interface TemplateCheckboxOptionProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const TemplateCheckboxOption = ({
  label,
  checked,
  disabled = false,
  onChange,
}: TemplateCheckboxOptionProps) => (
  <Box
    component="label"
    sx={(theme) => ({
      display: 'flex',
      alignItems: 'flex-start',
      gap: 0.75,
      minWidth: 0,
      minHeight: 44,
      p: 0.75,
      border: 1,
      borderColor: 'divider',
      borderRadius: 'var(--app-radius-control)',
      bgcolor: 'background.paper',
      color: disabled ? 'text.disabled' : 'text.primary',
      cursor: disabled ? 'default' : 'pointer',
      '&:focus-within': {
        outline: '2px solid',
        outlineColor: 'primary.main',
        outlineOffset: 2,
      },
      ...(checked && !disabled && selectedSurface(theme)),
    })}
  >
    <Checkbox
      size="small"
      checked={checked}
      disabled={disabled}
      onChange={(_, value) => onChange(value)}
      sx={{
        p: 0.5,
        flexShrink: 0,
        '&.Mui-checked:not(.Mui-disabled)': { color: 'inherit' },
      }}
    />
    <Typography
      component="span"
      sx={{
        minWidth: 0,
        overflowWrap: 'anywhere',
        fontSize: '14px',
        lineHeight: '28px',
      }}
    >
      {label}
    </Typography>
  </Box>
);
export default TemplateCheckboxOption;
