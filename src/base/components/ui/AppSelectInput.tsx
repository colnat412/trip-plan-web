'use client';

import { useMemo, useState, type FocusEvent } from 'react';
import { Autocomplete, Box, type SelectChangeEvent } from '@mui/material';
import { useTranslations } from 'next-intl';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AppTextField from './AppTextField';
import { matchesSearch } from '@/base/utils/search';
import {
  SELECT_MENU_MAX_HEIGHT,
  SELECT_MENU_VIEWPORT_GAP,
} from '@/base/utils/select-menu';
import type { AppSelectOption, AppSelectProps } from './AppSelect';

/** Editable combobox mode behind the shared AppSelect API. */
const AppSelectInput = ({
  label,
  options,
  helperText,
  error,
  fullWidth,
  size = 'medium',
  value,
  defaultValue,
  variantType = 'form',
  onChange,
  sx,
  searchPlaceholder,
  multiple = false,
  disabled,
  readOnly,
  required,
  name,
  id,
  autoFocus,
  onBlur,
  onFocus,
  onOpen,
  onClose,
  open,
  defaultOpen,
  inputProps,
  inputRef,
}: AppSelectProps) => {
  const t = useTranslations('select');
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const currentValue = value !== undefined ? value : internalValue;
  const selected = useMemo(() => {
    const findOption = (item: unknown): AppSelectOption =>
      options.find((option) => String(option.value) === String(item)) ?? {
        value: typeof item === 'number' ? item : String(item),
        label: String(item),
      };
    if (multiple)
      return Array.isArray(currentValue) ? currentValue.map(findOption) : [];
    if (
      currentValue == null ||
      (currentValue === '' && !options.some((option) => option.value === ''))
    )
      return null;
    return findOption(currentValue);
  }, [options, currentValue, multiple]);
  const compact = variantType !== 'form';
  const isOpen = open ?? internalOpen;

  return (
    <Autocomplete<AppSelectOption, boolean, false, false>
      id={id}
      options={options}
      value={selected}
      multiple={multiple}
      disabled={disabled}
      readOnly={readOnly}
      fullWidth={fullWidth ?? !compact}
      size={compact ? 'small' : size}
      open={isOpen}
      openOnFocus
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      disableCloseOnSelect={multiple}
      onOpen={(event) => {
        setInternalOpen(true);
        onOpen?.(event);
      }}
      onClose={(event) => {
        setInternalOpen(false);
        onClose?.(event);
      }}
      popupIcon={<KeyboardArrowDownRoundedIcon />}
      clearText={t('clear')}
      openText={t('open')}
      closeText={t('close')}
      noOptionsText={t('noResults')}
      slotProps={{
        listbox: {
          sx: {
            maxHeight: `min(${SELECT_MENU_MAX_HEIGHT}px, 40dvh)`,
            overscrollBehaviorY: 'contain',
          },
        },
        popper: {
          modifiers: [
            { name: 'flip', options: { padding: SELECT_MENU_VIEWPORT_GAP } },
            {
              name: 'preventOverflow',
              options: { padding: SELECT_MENU_VIEWPORT_GAP },
            },
          ],
        },
      }}
      getOptionLabel={(option) => option.label}
      getOptionKey={(option) => option.value}
      isOptionEqualToValue={(option, selectedOption) =>
        String(option.value) === String(selectedOption.value)
      }
      filterOptions={(items, state) =>
        items.filter((option) => matchesSearch(option.label, state.inputValue))
      }
      onKeyDown={(event) => {
        if (event.key === 'Enter' && isOpen) event.preventDefault();
      }}
      onChange={(_event, next) => {
        const nextValue = Array.isArray(next)
          ? next.map((option) => option.value)
          : (next?.value ?? '');
        if (value === undefined) setInternalValue(nextValue);
        // Match MUI Select's native change-event contract, including number/array values.
        const changeEvent = new Event('change', { bubbles: true });
        Object.defineProperty(changeEvent, 'target', {
          writable: true,
          value: { value: nextValue, name: name ?? '' },
        });
        onChange?.(changeEvent as SelectChangeEvent<unknown>, null);
      }}
      sx={[
        { minWidth: 0 },
        ...(compact
          ? [
              {
                '& .MuiOutlinedInput-root': {
                  minHeight: variantType === 'filter' ? 38 : 32,
                  borderRadius: variantType === 'filter' ? 'var(--app-radius-control)' : 'var(--app-radius-small)',
                  bgcolor: 'background.paper',
                  fontSize: variantType === 'filter' ? '13px' : '12px',
                  py: 0,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '& .MuiAutocomplete-input': { minWidth: '24px !important' },
              },
            ]
          : []),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      renderOption={(props, option, state) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            component="li"
            key={key}
            {...optionProps}
            sx={{ display: 'flex', gap: 1, minWidth: 0 }}
          >
            {option.icon}
            <Box
              component="span"
              sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}
            >
              {option.label}
            </Box>
            {state.selected && (
              <CheckRoundedIcon
                sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }}
              />
            )}
          </Box>
        );
      }}
      renderInput={(params) => (
        <>
          <AppTextField
            {...params}
            label={compact ? undefined : label}
            placeholder={searchPlaceholder ?? (compact ? label : undefined)}
            error={error}
            helperText={helperText}
            autoFocus={autoFocus}
            inputRef={inputRef}
            required={
              required &&
              (!multiple || !Array.isArray(selected) || selected.length === 0)
            }
            slotProps={{
              ...params.slotProps,
              htmlInput: {
                ...inputProps,
                ...params.slotProps.htmlInput,
                onBlur: (event: FocusEvent<HTMLInputElement>) => {
                  params.slotProps.htmlInput.onBlur?.(event);
                  onBlur?.(event);
                },
                onFocus: (event: FocusEvent<HTMLInputElement>) => {
                  params.slotProps.htmlInput.onFocus?.(event);
                  onFocus?.(event);
                },
                name: undefined,
                'aria-label': inputProps?.['aria-label'] ?? label,
              },
            }}
          />
          {name && (
            <input
              type="hidden"
              name={name}
              disabled={disabled}
              value={
                Array.isArray(currentValue)
                  ? currentValue.join(',')
                  : currentValue == null
                    ? ''
                    : String(currentValue)
              }
            />
          )}
        </>
      )}
    />
  );
};

export default AppSelectInput;
