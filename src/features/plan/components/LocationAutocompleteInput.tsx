'use client';

import React, { useState, useMemo } from 'react';
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  InputAdornment,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import { useTranslations } from 'next-intl';
import { AppTextField } from '@/base/components/ui';
import usePlacesSearch from '../hooks/usePlacesSearch';

export interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
  source: 'google' | 'osm' | 'custom';
}

export interface LocationAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
}

const LocationAutocompleteInput = ({
  value,
  onChange,
  label,
  placeholder,
  error,
  helperText,
  required,
  fullWidth = true,
}: LocationAutocompleteInputProps) => {
  const theme = useTheme();
  const t = useTranslations('plan.dialog');

  const [prevValue, setPrevValue] = useState<string>(value || '');
  const [inputValue, setInputValue] = useState<string>(value || '');
  const [searchQuery, setSearchQuery] = useState('');
  const { options: displayOptions, loading: isLoading } =
    usePlacesSearch(searchQuery);

  if ((value || '') !== prevValue) {
    setPrevValue(value || '');
    setInputValue(value || '');
    if ((value || '') !== inputValue) setSearchQuery('');
  }

  const selectedValue = useMemo(() => {
    return value || '';
  }, [value]);

  return (
    <Autocomplete<PlacePrediction | string, false, false, true>
      freeSolo
      value={selectedValue}
      inputValue={inputValue}
      options={displayOptions}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.description || option.mainText || '';
      }}
      filterOptions={(optionsList, params) => {
        const filtered = [...optionsList] as PlacePrediction[];
        const rawInput = params.inputValue.trim();

        if (rawInput !== '') {
          const isExactMatch = optionsList.some(
            (opt) =>
              typeof opt !== 'string' &&
              opt.description.toLowerCase() === rawInput.toLowerCase(),
          );

          if (!isExactMatch) {
            filtered.unshift({
              placeId: 'custom-user-input',
              mainText: rawInput,
              secondaryText: t('useRawText'),
              description: rawInput,
              source: 'custom',
            });
          }
        }
        return filtered;
      }}
      onInputChange={(_event, newInputValue, reason) => {
        setInputValue(newInputValue);
        if (reason === 'input' || reason === 'clear') {
          setSearchQuery(newInputValue);
          onChange(newInputValue);
        }
      }}
      onChange={(_event, newValue) => {
        setSearchQuery('');
        if (!newValue) {
          onChange('');
          setInputValue('');
        } else if (typeof newValue === 'string') {
          onChange(newValue);
          setInputValue(newValue);
        } else {
          const chosenText = newValue.description || newValue.mainText || '';
          onChange(chosenText);
          setInputValue(chosenText);
        }
      }}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        const isCustom =
          typeof option !== 'string' && option.source === 'custom';
        const mainText = typeof option === 'string' ? option : option.mainText;
        const secondaryText =
          typeof option === 'string' ? '' : option.secondaryText;
        const source = typeof option === 'string' ? undefined : option.source;

        return (
          <Box
            component="li"
            key={key}
            {...otherProps}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1,
              px: 1.5,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: isCustom
                  ? 'action.hover'
                  : alpha(theme.palette.primary.main, 0.12),
                color: isCustom ? 'text.secondary' : 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isCustom ? (
                <EditLocationOutlinedIcon sx={{ fontSize: '18px' }} />
              ) : (
                <PlaceRoundedIcon sx={{ fontSize: '18px' }} />
              )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {mainText}
              </Typography>
              {secondaryText && (
                <Typography
                  sx={{
                    fontSize: '11px',
                    color: isCustom ? 'primary.main' : 'text.secondary',
                    fontWeight: isCustom ? 500 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {secondaryText}
                </Typography>
              )}
            </Box>

            {source && source !== 'custom' && (
              <Chip
                label={source === 'google' ? 'Google Maps' : 'Bản đồ'}
                size="small"
                sx={{
                  height: '18px',
                  fontSize: '9px',
                  fontWeight: 600,
                  bgcolor:
                    source === 'google'
                      ? alpha(theme.palette.info.main, 0.1)
                      : 'action.hover',
                  color: source === 'google' ? 'info.main' : 'text.secondary',
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
        );
      }}
      renderInput={(params) => (
        <AppTextField
          id={params.id}
          disabled={params.disabled}
          fullWidth={fullWidth ?? params.fullWidth}
          size={params.size}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          slotProps={{
            inputLabel: params.slotProps.inputLabel,
            htmlInput: params.slotProps.htmlInput,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <PlaceRoundedIcon
                      sx={{
                        fontSize: '18px',
                        color: 'text.secondary',
                        ml: 0.5,
                      }}
                    />
                  </InputAdornment>
                  {params.slotProps.input.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress
                      color="inherit"
                      size={16}
                      sx={{ mr: 1, color: 'text.secondary' }}
                    />
                  ) : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default LocationAutocompleteInput;
