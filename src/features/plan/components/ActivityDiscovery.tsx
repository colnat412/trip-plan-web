'use client';

import { useState } from 'react';
import { Box, Stack, Typography, ButtonBase, InputAdornment, Divider } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppEmptyState, AppTextField, AppFilterChipGroup, AppLoadingState } from '@/base/components/ui';
import AppMascot from '@/base/components/ui/AppMascot';
import { ACTIVITY_CATEGORIES, CATEGORY_CONFIG } from '@/base/constants';
import usePlacesSearch from '../hooks/usePlacesSearch';
import type { ActivityCategory } from '../types';
import type { PlacePrediction } from './LocationAutocompleteInput';

interface ActivityDiscoveryProps {
  destination: string;
  category: ActivityCategory;
  disabled: boolean;
  onCategoryChange: (category: ActivityCategory) => void;
  onChoose: (place: PlacePrediction) => void;
  onManual: () => void;
}

const ActivityDiscovery = ({ destination, category, disabled, onCategoryChange, onChoose, onManual }: ActivityDiscoveryProps) => {
  const j = useTranslations('journey');
  const c = useTranslations('plan.categories');
  const [search, setSearch] = useState('');
  // Existing server search supplies real places; no invented ratings or distances.
  const query = [search.trim(), category === 'OTHER' ? '' : j(`categoryKeywords.${category}`), destination.trim()].filter(Boolean).join(' ');
  const { options, loading, error } = usePlacesSearch(disabled ? '' : query);
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <AppMascot size={80} />
        <Typography component="h2" sx={{ fontSize: 18, fontWeight: 600 }}>{j('activity')}</Typography>
      </Stack>
      <AppFilterChipGroup label={c(category)} showAll={false} value={category} onChange={(value) => { if (!disabled) onCategoryChange(value); }}
        options={ACTIVITY_CATEGORIES.map((value) => ({ value, label: c(value), icon: CATEGORY_CONFIG[value].icon }))} />
      <AppTextField label={j('search')} value={search} disabled={disabled} onChange={(event) => setSearch(event.target.value)}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> } }} />
      <Typography component="h3" sx={{ fontWeight: 700 }}>{destination ? j('suggestions', { destination }) : j('choose')}</Typography>
      {loading ? <AppLoadingState local sx={{ minHeight: 120 }} /> : error ? (
        <Typography role="status" color="text.secondary">{j('unavailable')}</Typography>
      ) : options.length ? (
        <Stack divider={<Divider />}>
          {options.slice(0, 6).map((place) => (
            <ButtonBase key={`${place.source}-${place.placeId}`} disabled={disabled} onClick={() => onChoose(place)}
              sx={{ px: 1, py: 2, gap: 1.5, textAlign: 'left', justifyContent: 'flex-start', borderRadius: 0, minHeight: 72,
                '&:hover': { bgcolor: 'action.hover' }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 } }}>
              <Box sx={{ color: 'primary.main', display: 'flex' }}>{CATEGORY_CONFIG[category].icon}</Box>
              <Box sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
                <Typography sx={{ fontWeight: 700 }}>{place.mainText}</Typography>
                <Typography variant="caption" color="text.secondary">{place.secondaryText}</Typography>
              </Box>
              <ChevronRightRoundedIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
            </ButtonBase>
          ))}
        </Stack>
      ) : <AppEmptyState compact title={j('empty')} />}
      <AppButton intent="secondary" disabled={disabled} onClick={onManual}>{j('manual')}</AppButton>
    </Stack>
  );
};
export default ActivityDiscovery;
