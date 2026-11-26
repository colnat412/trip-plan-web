'use client';

import { Checkbox } from '@mui/material';

/** The option owns interaction and aria-selected; this checkbox is its visual cue. */
interface AppSelectOptionCheckboxProps {
  checked: boolean;
  disabled?: boolean;
}

export default function AppSelectOptionCheckbox({ checked, disabled = false }: AppSelectOptionCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      disabled={disabled}
      disableRipple
      tabIndex={-1}
      aria-hidden="true"
      slotProps={{ input: { tabIndex: -1, readOnly: true } }}
      sx={{ p: 0.5, flexShrink: 0, pointerEvents: 'none', color: 'inherit', '&.Mui-checked': { color: 'inherit' } }}
    />
  );
}
