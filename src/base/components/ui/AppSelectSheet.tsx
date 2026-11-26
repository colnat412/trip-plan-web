'use client';

import { useId, useState, type ReactNode, type SyntheticEvent } from 'react';
import { Box, MenuItem, MenuList, Typography, type SelectChangeEvent } from '@mui/material';
import { useTranslations } from 'next-intl';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AppLoadingIndicator from './AppLoadingIndicator';
import AppDialog from './AppDialog';
import AppButton from './AppButton';
import AppTextField from './AppTextField';
import AppSelectOptionCheckbox from './AppSelectOptionCheckbox';
import type { AppSelectProps } from './AppSelect';

/** Keep the form control in place; present choices as a mobile sheet. */
interface AppSelectSheetProps extends AppSelectProps {
  renderTrigger: (overrides: Partial<AppSelectProps>) => ReactNode;
}

export default function AppSelectSheet(props: AppSelectSheetProps) {
  const { options, label, onChange, renderTrigger, multiple, searchable } = props;
  const t = useTranslations('select');
  const dialog = useTranslations('dialog');
  const listId = useId();
  const [internalOpen, setInternalOpen] = useState(props.defaultOpen ?? false);
  const [internalValue, setInternalValue] = useState(props.defaultValue ?? (multiple ? [] : ''));
  const [search, setSearch] = useState('');
  const [openedBy, setOpenedBy] = useState<SyntheticEvent | null>(null);
  const open = props.open ?? internalOpen;
  const value = props.value !== undefined ? props.value : internalValue;
  const close = () => {
    setInternalOpen(false);
    setSearch('');
    props.onSearchChange?.('');
    if (openedBy) props.onClose?.(openedBy);
  };
  const isSelected = (optionValue: string | number) => multiple && Array.isArray(value)
    ? value.some((item) => String(item) === String(optionValue))
    : String(value) === String(optionValue);
  const visibleOptions = props.optionsLoading || props.optionsError ? [] : options;

  return (
    <>
      {renderTrigger({
        value,
        searchable: false,
        open: false,
        onOpen: (event) => {
          if (props.disabled || props.readOnly) return;
          setOpenedBy(event);
          setInternalOpen(true);
          props.onOpen?.(event);
        },
        SelectDisplayProps: {
          ...props.SelectDisplayProps,
          'aria-expanded': open,
          'aria-controls': open ? listId : undefined,
        },
      })}
      <AppDialog open={open} onClose={close} title={label} showSheetHandle
        actions={multiple ? <AppButton data-dialog-action="primary" onClick={close}>{dialog('confirm')}</AppButton> : undefined}>
        {searchable && <AppTextField value={search} onChange={(event) => { setSearch(event.target.value); props.onSearchChange?.(event.target.value); }}
          placeholder={props.searchPlaceholder ?? label} slotProps={{ htmlInput: { 'aria-label': props.searchPlaceholder ?? label } }} />}
        {props.optionsLoading && <AppLoadingIndicator />}
        {props.optionsError && <Typography role="alert" color="error">{t('searchUnavailable')}</Typography>}
        <MenuList id={listId} role="listbox" aria-label={label} aria-multiselectable={multiple || undefined} autoFocusItem={!searchable} sx={{ p: 0 }}>
          {visibleOptions.map((option) => {
            const selected = isSelected(option.value);
            return <MenuItem key={String(option.value)} selected={selected}
              role="option" aria-selected={selected} disabled={props.disabled || props.readOnly}
              sx={{ minHeight: 48, gap: 1.25, borderRadius: 'var(--app-radius-small)', whiteSpace: 'normal' }}
              onClick={() => {
                const next = multiple
                  ? selected
                    ? (Array.isArray(value) ? value : []).filter((item) => String(item) !== String(option.value))
                    : [...(Array.isArray(value) ? value : []), option.value]
                  : option.value;
                if (props.value === undefined) setInternalValue(next);
                const changeEvent = new Event('change', { bubbles: true });
                Object.defineProperty(changeEvent, 'target', { value: { value: next, name: props.name ?? '' } });
                onChange?.(changeEvent as SelectChangeEvent<unknown>, null);
                if (!multiple) close();
              }}>
              {multiple && <AppSelectOptionCheckbox checked={selected} disabled={props.disabled || props.readOnly} />}
              {option.icon}
              <Box component="span" sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>{option.label}</Box>
              {!multiple && selected && <CheckRoundedIcon sx={{ color: 'primary.main', fontSize: 20, flexShrink: 0 }} />}
            </MenuItem>;
          })}
        </MenuList>
        {!visibleOptions.length && <Typography color="text.secondary">{t('noResults')}</Typography>}
      </AppDialog>
    </>
  );
}
