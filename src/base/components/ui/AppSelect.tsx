'use client';

import { selectedSurface } from '@/base/theme/surfaces';

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  type SelectProps,
  type SelectChangeEvent,
  Box,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AppSelectSheet from './AppSelectSheet';
import AppSelectOptionCheckbox from './AppSelectOptionCheckbox';
import AppSelectInput from './AppSelectInput';
import useSelectMenu from '@/base/hooks/use-select-menu';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export interface AppSelectOption {
  value: string | number;
  label: string;
  searchText?: string;
  icon?: React.ReactNode;
}

export interface AppSelectProps extends Omit<SelectProps, 'onChange'> {
  label: string;
  options: AppSelectOption[];
  helperText?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  error?: boolean;
  variantType?: 'form' | 'filter' | 'compact';
  onChange?: (
    event: SelectChangeEvent<unknown>,
    child: React.ReactNode,
  ) => void;
}

const AppSelectControl = ({
  label,
  options,
  helperText,
  searchable = false,
  searchPlaceholder,
  error,
  fullWidth,
  size = 'medium',
  value,
  variantType = 'form',
  onChange,
  sx,
  ...selectProps
}: AppSelectProps) => {
  const labelId = React.useId();
  const menu = useSelectMenu(selectProps);
  const multiple = Boolean(selectProps.multiple);
  if (searchable && !selectProps.native) {
    return (
      <AppSelectInput
        {...selectProps}
        label={label}
        options={options}
        helperText={helperText}
        error={error}
        fullWidth={fullWidth}
        size={size}
        value={value}
        variantType={variantType}
        onChange={onChange}
        sx={sx}
        searchPlaceholder={searchPlaceholder}
      />
    );
  }

  if (variantType === 'filter') {
    const isFiltered = Array.isArray(value)
      ? value.length > 0
      : Boolean(value && value !== 'ALL' && value !== '');
    const selectedOption = options.find(
      (opt) => String(opt.value) === String(value),
    );

    return (
      <Select
        {...selectProps}
        {...menu}
        value={value ?? ''}
        onChange={onChange}
        displayEmpty
        inputProps={{ 'aria-label': label, ...selectProps.inputProps }}
        size="small"
        fullWidth={fullWidth ?? false}
        IconComponent={KeyboardArrowDownRoundedIcon}
        renderValue={(selected) => {
          if (
            !selected ||
            selected === 'ALL' ||
            selected === '' ||
            (Array.isArray(selected) && selected.length === 0)
          ) {
            return (
              <Box
                component="span"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {label}
              </Box>
            );
          }
          return (
            <Box
              component="span"
              sx={{
                color: 'inherit',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              {selectedOption?.icon}
              <Box
                component="span"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {Array.isArray(selected)
                  ? selected
                      .map(
                        (item) =>
                          options.find(
                            (option) => String(option.value) === String(item),
                          )?.label ?? String(item),
                      )
                      .join(', ')
                  : selectedOption?.label || String(selected)}
              </Box>
            </Box>
          );
        }}
        MenuProps={{
          ...menu.MenuProps,
          slotProps: {
            ...menu.MenuProps.slotProps,
            paper: (ownerState) => ({
              ...menu.MenuProps.slotProps.paper(ownerState),
              sx: [
                {
                  borderRadius: 'var(--app-radius-card)',
                  border: '1px solid',
                  borderColor: 'divider',
                  minWidth: 150,
                },
                ...menu.MenuProps.slotProps.paper(ownerState).sx,
              ],
            }),
          },
        }}
        sx={[(theme) => ({
          height: 38,
          minHeight: '38px !important',
          borderRadius: 'var(--app-radius-control)',
          bgcolor: isFiltered ? 'action.selected' : 'background.paper',
          border: '1px solid',
          borderColor: isFiltered ? 'primary.main' : 'divider',
          fontSize: '13px',
          fontWeight: 600,
          transition:
            'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
          '& fieldset': {
            border: 'none',
          },
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: isFiltered ? 'action.selected' : 'action.hover',
          },
          '& .MuiSelect-select': {
            py: '7px !important',
            px: '12px !important',
            pr: '34px !important',
            fontSize: '13px',
            minHeight: 'unset !important',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiSelect-icon': {
            fontSize: 18,
            right: '8px',
            color: isFiltered ? 'primary.main' : 'text.secondary',
          },
          ...(isFiltered && selectedSurface(theme)),
        }), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      >
        {options.map((option) => {
          const isSelected = Array.isArray(value)
            ? value.some((item) => String(item) === String(option.value))
            : String(option.value) === String(value);
          return (
            <MenuItem
              key={String(option.value)}
              value={option.value}
              selected={isSelected}
              sx={{
                display: 'flex',
                fontSize: '13px',
                fontWeight: isSelected ? 700 : 500,
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {multiple && <AppSelectOptionCheckbox checked={isSelected} disabled={selectProps.disabled || selectProps.readOnly} />}
                {option.icon}
                <span>{option.label}</span>
              </Box>
              {!multiple && isSelected && (
                <CheckRoundedIcon
                  sx={{ fontSize: 16, color: 'primary.main' }}
                />
              )}
            </MenuItem>
          );
        })}
      </Select>
    );
  }

  if (variantType === 'compact') {
    const selectedOption = options.find(
      (opt) => String(opt.value) === String(value),
    );

    return (
      <Select
        {...selectProps}
        {...menu}
        value={value ?? ''}
        onChange={onChange}
        size="small"
        fullWidth={fullWidth ?? false}
        IconComponent={KeyboardArrowDownRoundedIcon}
        renderValue={(selected) => (
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              fontSize: '12px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {Array.isArray(selected)
              ? selected
                  .map(
                    (item) =>
                      options.find(
                        (option) => String(option.value) === String(item),
                      )?.label ?? String(item),
                  )
                  .join(', ')
              : selectedOption?.label || String(selected)}
          </Box>
        )}
        MenuProps={{
          ...menu.MenuProps,
          slotProps: {
            ...menu.MenuProps.slotProps,
            paper: (ownerState) => ({
              ...menu.MenuProps.slotProps.paper(ownerState),
              sx: [
                {
                  borderRadius: 'var(--app-radius-card)',
                  border: '1px solid',
                  borderColor: 'divider',
                  minWidth: 120,
                },
                ...menu.MenuProps.slotProps.paper(ownerState).sx,
              ],
            }),
          },
        }}
        sx={{
          height: 32,
          minHeight: '32px !important',
          borderRadius: 'var(--app-radius-small)',
          bgcolor: 'background.paper',
          fontSize: '12px',
          fontWeight: 600,
          border: '1px solid',
          borderColor: 'divider',
          '& fieldset': {
            border: 'none',
          },
          '&:hover': {
            borderColor: 'primary.main',
          },
          '& .MuiSelect-select': {
            py: '5px !important',
            px: '10px !important',
            pr: '28px !important',
            fontSize: '12px',
            minHeight: 'unset !important',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiSelect-icon': {
            fontSize: 16,
            right: '6px',
            color: 'text.secondary',
          },
          ...sx,
        }}
      >
        {options.map((option) => {
          const isSelected = Array.isArray(value)
            ? value.some((item) => String(item) === String(option.value))
            : String(option.value) === String(value);
          return (
            <MenuItem
              key={String(option.value)}
              value={option.value}
              selected={isSelected}
              sx={{
                display: 'flex',
                fontSize: '12px',
                fontWeight: isSelected ? 700 : 500,
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {multiple && <AppSelectOptionCheckbox checked={isSelected} disabled={selectProps.disabled || selectProps.readOnly} />}
                {option.icon}
                <span>{option.label}</span>
              </Box>
              {!multiple && isSelected && (
                <CheckRoundedIcon
                  sx={{ fontSize: 15, color: 'primary.main' }}
                />
              )}
            </MenuItem>
          );
        })}
      </Select>
    );
  }

  const isFullWidth = fullWidth ?? true;
  return (
    <FormControl fullWidth={isFullWidth} error={error} size={size}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        {...selectProps}
        {...menu}
        labelId={labelId}
        label={label}
        value={value}
        onChange={onChange}
        sx={sx}
      >
        {options.map((option) => {
          const checked = Array.isArray(value) && value.some((item) => String(item) === String(option.value));
          return (
            <MenuItem key={String(option.value)} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {multiple && <AppSelectOptionCheckbox checked={checked} disabled={selectProps.disabled || selectProps.readOnly} />}
                {option.icon}
                <span>{option.label}</span>
              </Box>
            </MenuItem>
          );
        })}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

const AppSelect = (props: AppSelectProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [internalValue, setInternalValue] = React.useState<unknown>(props.defaultValue ?? (props.multiple ? [] : ''));
  const controlProps: AppSelectProps = {
    ...props,
    value: props.value !== undefined ? props.value : internalValue,
    onChange: (event, child) => {
      if (props.value === undefined) setInternalValue(event.target.value);
      props.onChange?.(event, child);
    },
  };
  if (isMobile && !props.native) {
    return <AppSelectSheet {...controlProps} renderTrigger={(overrides) => <AppSelectControl {...controlProps} {...overrides} />} />;
  }
  return <AppSelectControl {...controlProps} />;
};

export default AppSelect;
