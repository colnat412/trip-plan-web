'use client';

import React, { useMemo, useState } from 'react';
import {
  Autocomplete,
  type AutocompleteInputChangeReason,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import { useTranslations } from 'next-intl';

import { AppTextField } from '@/base/components/ui';
import useDestinationSearch from '../hooks/useDestinationSearch';
import type { DestinationItem } from '@/app/api/trip/destinations/route';

export interface DestinationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

const DestinationAutocomplete = ({
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  label,
  placeholder,
}: DestinationAutocompleteProps) => {
  const t = useTranslations('trip');
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { options, loading } = useDestinationSearch(searchQuery, !disabled);

  const handleInputChange = (
    _event: React.SyntheticEvent,
    newInputValue: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    setInputValue(newInputValue);

    if (reason === 'input' || reason === 'clear') {
      setSearchQuery(newInputValue);
    }
    if (reason === 'clear') onChange('');
  };

  const currentOption = useMemo<DestinationItem | null>(() => {
    if (!value) return null;
    return {
      id: 'custom-selected',
      name: value,
      country: '',
      label: value,
    };
  }, [value]);

  return (
    <Autocomplete<DestinationItem, false, false, false>
      disabled={disabled}
      options={options}
      filterOptions={(items) => items}
      loading={loading}
      value={currentOption}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={(_event, selected) => {
        if (selected) {
          onChange(selected.label);
        } else {
          onChange('');
        }
      }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.label
      }
      isOptionEqualToValue={(option, val) => option.label === val.label}
      noOptionsText={t('noDestinationsFound')}
      loadingText={t('searchingDestinations')}
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <Box component="li" key={key} {...restProps}>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                width: '100%',
                alignItems: 'center',
                py: 0.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: option.isPopular ? 'warning.light' : 'action.hover',
                  color: option.isPopular ? 'warning.dark' : 'primary.main',
                  flexShrink: 0,
                }}
              >
                {option.isPopular ? (
                  <WhatshotRoundedIcon sx={{ fontSize: 18 }} />
                ) : (
                  <PlaceRoundedIcon sx={{ fontSize: 18 }} />
                )}
              </Box>
              <Stack spacing={0.2} sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {option.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '11px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {[option.region, option.country].filter(Boolean).join(' · ')}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        );
      }}
      renderInput={(params) => {
        const { slotProps, ...restParams } = params;
        return (
          <AppTextField
            {...restParams}
            label={label || t('destination')}
            placeholder={placeholder || t('destinationPlaceholder')}
            required={required}
            error={error}
            helperText={helperText || t('destinationHelper')}
            slotProps={{
              ...slotProps,
              input: {
                ...slotProps.input,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress
                        color="inherit"
                        size={18}
                        sx={{ mr: 1 }}
                      />
                    ) : null}
                    {slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        );
      }}
    />
  );
};

export default DestinationAutocomplete;
