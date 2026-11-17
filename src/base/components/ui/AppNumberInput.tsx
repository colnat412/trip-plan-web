'use client';

import React, { useState, useRef } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  Typography,
} from '@mui/material';
import { formatNumberInput, parseNumberInput } from '@/base/utils/currency';

export interface AppNumberInputProps extends Omit<
  TextFieldProps,
  'value' | 'onChange' | 'type'
> {
  value?: number | string | null;
  onValueChange?: (numericValue: number | undefined, rawString: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allowDecimals?: boolean;
  currencySuffix?: string;
  emphasis?: 'default' | 'primary';
}

const AppNumberInput = ({
  value,
  onValueChange,
  onChange,
  allowDecimals = false,
  currencySuffix,
  emphasis = 'default',
  sx,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  slotProps,
  ...restProps
}: AppNumberInputProps) => {
  const internalInputRef = useRef<HTMLInputElement | null>(null);

  const [prevValue, setPrevValue] = useState(value);
  const [displayValue, setDisplayValue] = useState<string>(() =>
    formatNumberInput(value, allowDecimals),
  );

  if (value !== prevValue) {
    setPrevValue(value);
    const formatted = formatNumberInput(value, allowDecimals);
    const { rawString } = parseNumberInput(displayValue);
    if (String(value ?? '') !== rawString) {
      setDisplayValue(formatted);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const rawVal = input.value;
    const currentCursor = input.selectionStart ?? rawVal.length;

    const textBeforeCursor = rawVal.slice(0, currentCursor);
    const digitsBeforeCursor = (textBeforeCursor.match(/\d/g) || []).length;
    const hasDotBeforeCursor = textBeforeCursor.includes('.');

    const formatted = formatNumberInput(rawVal, allowDecimals);
    const { numericValue, rawString } = parseNumberInput(formatted);

    setDisplayValue(formatted);

    requestAnimationFrame(() => {
      if (internalInputRef.current) {
        let newCursor = 0;
        let count = 0;
        for (let i = 0; i < formatted.length; i++) {
          if (formatted[i] === '.' && hasDotBeforeCursor) {
            newCursor = i + 1;
            break;
          }
          if (/\d/.test(formatted[i])) {
            count++;
            if (count === digitsBeforeCursor) {
              newCursor = i + 1;
              break;
            }
          }
        }
        if (newCursor === 0 && digitsBeforeCursor === 0) {
          newCursor = 0;
        } else if (newCursor === 0) {
          newCursor = formatted.length;
        }
        internalInputRef.current.setSelectionRange(newCursor, newCursor);
      }
    });

    onValueChange?.(numericValue, rawString);

    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...input,
          value: rawString,
          name: input.name,
        },
        currentTarget: {
          ...input,
          value: rawString,
          name: input.name,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const input = e.currentTarget;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      if (start !== null && start === end && start > 1) {
        if (input.value[start - 1] === ',') {
          e.preventDefault();
          const beforeComma = input.value.slice(0, start - 2);
          const afterComma = input.value.slice(start);
          const newValue = beforeComma + afterComma;
          const formatted = formatNumberInput(newValue, allowDecimals);
          const { numericValue, rawString } = parseNumberInput(formatted);

          setDisplayValue(formatted);
          onValueChange?.(numericValue, rawString);

          if (onChange) {
            const syntheticEvent = {
              ...e,
              target: { ...input, value: rawString, name: input.name },
              currentTarget: { ...input, value: rawString, name: input.name },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }

          requestAnimationFrame(() => {
            if (internalInputRef.current) {
              const newPos = Math.max(0, start - 2);
              internalInputRef.current.setSelectionRange(newPos, newPos);
            }
          });
        }
      }
    }
    restProps.onKeyDown?.(e);
  };

  const adornment = currencySuffix ? (
    <InputAdornment position="end">
      <Typography
        sx={{
          fontSize: '13px',
          color: 'text.secondary',
          fontWeight: 600,
          userSelect: 'none',
        }}
      >
        {currencySuffix}
      </Typography>
    </InputAdornment>
  ) : undefined;

  const existingInputSlot = slotProps?.input;
  const resolvedInputSlotProps =
    typeof existingInputSlot === 'function'
      ? existingInputSlot
      : {
          ...existingInputSlot,
          endAdornment:
            (existingInputSlot as { endAdornment?: React.ReactNode })
              ?.endAdornment ?? adornment,
        };

  return (
    <TextField
      {...restProps}
      placeholder={restProps.placeholder ?? (emphasis === 'primary' ? '0' : undefined)}
      fullWidth={fullWidth}
      size={size}
      variant={emphasis === 'primary' ? 'standard' : variant}
      sx={[
        ...(emphasis === 'primary' ? [{
          minWidth: 0,
          '& .MuiInputBase-root': { bgcolor: 'transparent', minHeight: 72 },
          '& .MuiInputBase-input': {
            fontSize: displayValue.length > 14 ? { xs: '26px', sm: '32px' } : { xs: '34px', sm: '42px' },
            fontWeight: 700, lineHeight: 1.25, py: 1.5, minWidth: 0,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px',
          },
          '& .MuiInputAdornment-root': { flexShrink: 0 },
          '& .MuiFormHelperText-root': { mx: 0, overflowWrap: 'anywhere' },
        }] : []),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      inputRef={internalInputRef}
      slotProps={{
        ...slotProps,
        inputLabel: emphasis === 'primary' && typeof slotProps?.inputLabel !== 'function'
          ? { ...slotProps?.inputLabel, shrink: true }
          : slotProps?.inputLabel,
        htmlInput:
          typeof slotProps?.htmlInput === 'function'
            ? slotProps.htmlInput
            : {
                inputMode: allowDecimals ? 'decimal' : 'numeric',
                ...slotProps?.htmlInput,
              },
        input: resolvedInputSlotProps,
      }}
    />
  );
};

export default AppNumberInput;
