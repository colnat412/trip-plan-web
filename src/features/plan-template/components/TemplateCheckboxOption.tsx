'use client';

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
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 0.75,
      minWidth: 0,
      minHeight: 44,
      p: 0.75,
      border: 1,
      borderColor: checked ? 'primary.main' : 'divider',
      borderRadius: '10px',
      bgcolor: checked ? 'action.selected' : 'background.paper',
      color: disabled ? 'text.disabled' : 'text.primary',
      cursor: disabled ? 'default' : 'pointer',
      '&:focus-within': {
        outline: '2px solid',
        outlineColor: 'primary.main',
        outlineOffset: 2,
      },
    }}
  >
    <Checkbox
      size="small"
      checked={checked}
      disabled={disabled}
      onChange={(_, value) => onChange(value)}
      sx={{ p: 0.5, flexShrink: 0 }}
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
