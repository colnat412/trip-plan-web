'use client';

import { InputAdornment } from '@mui/material';
import type { ReactNode } from 'react';
import AppTextField from './AppTextField';

export interface AppPickerFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  icon: ReactNode;
  open: boolean;
  dialogId: string;
  onOpen: () => void;
}

const AppPickerField = ({ icon, open, dialogId, onOpen, ...props }: AppPickerFieldProps) => (
  <AppTextField
    {...props}
    onClick={props.disabled ? undefined : onOpen}
    onKeyDown={(event) => {
      if (!props.disabled && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onOpen();
      }
    }}
    slotProps={{
      inputLabel: { shrink: true },
      input: { readOnly: true, endAdornment: <InputAdornment position="end">{icon}</InputAdornment> },
      htmlInput: {
        'aria-haspopup': 'dialog', 'aria-expanded': open,
        'aria-controls': open ? dialogId : undefined,
      },
    }}
  />
);

export default AppPickerField;
