'use client';

import { useState } from 'react';
import { Box, Stack, Typography, ButtonBase, InputAdornment, Divider } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useTranslations } from 'next-intl';
import { AppEmptyState, AppTextField, AppFilterChipGroup, AppLoadingState, AppInfiniteScrollTrigger } from '@/base/components/ui';
import AppMascot from '@/base/components/ui/AppMascot';
import { ACTIVITY_CATEGORIES, CATEGORY_CONFIG } from '@/base/constants';
import useActivityDiscovery from '../hooks/useActivityDiscovery';
import type { ActivityCategory } from '../types';
import type { PlacePrediction } from './LocationAutocompleteInput';

interface ActivityDiscoveryProps {
  destination: string;
  category: ActivityCategory;
  disabled: boolean;
  onCategoryChange: (category: ActivityCategory) => void;
  onChoose: (place: PlacePrediction) => void;
}

const ActivityDiscovery = ({ destination, category, disabled, onCategoryChange, onChoose }: ActivityDiscoveryProps) => {
  const j = useTranslations('journey');
  const c = useTranslations('plan.categories');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState({ key: '', count: 6 });
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const resultKey = JSON.stringify([destination.trim(), category, search.trim()]);
  const visibleCount = page.key === resultKey ? page.count : 6;
  const { options, loading, error } = useActivityDiscovery(destination, category, search, disabled);
  const prompt = destination.trim().length < 2 ? 'discoveryDestinationRequired'
    : search.trim().length === 1 ? 'discoverySearchMinLength'
    : category === 'OTHER' && !search.trim() ? 'discoverySearchRequired' : null;
  return (
    <Stack spacing={2.5} sx={{ flex: '1 1 0', minHeight: 0, minWidth: 0 }}>
      <Stack spacing={2.5} sx={{ flexShrink: 0, minWidth: 0 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <AppMascot size={80} />
        <Typography component="h2" sx={{ fontSize: 18, fontWeight: 600 }}>{j('activity')}</Typography>
      </Stack>
      <AppFilterChipGroup label={c(category)} showAll={false} value={category} allValue={category}
        onChange={(value) => { if (!disabled && ACTIVITY_CATEGORIES.includes(value)) onCategoryChange(value); }}
        options={ACTIVITY_CATEGORIES.map((value) => ({ value, label: c(value), icon: CATEGORY_CONFIG[value].icon }))} />
      <AppTextField label={j('search')} value={search} disabled={disabled} onChange={(event) => setSearch(event.target.value)}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> } }} />
      <Typography component="h3" sx={{ fontWeight: 700 }}>{destination ? j('suggestions', { destination }) : j('choose')}</Typography>
      </Stack>
      {prompt ? <AppEmptyState compact title={j(prompt)} /> : loading ? <AppLoadingState local sx={{ flex: '1 1 0', minHeight: 0 }} /> : error ? (
        <Typography role="status" color="text.secondary">{j('unavailable')}</Typography>
      ) : options.length ? (
        <Box key={resultKey} ref={setScrollRoot} role="region" aria-label={j('choose')} tabIndex={0}
          sx={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', minWidth: 0,
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
          <Stack divider={<Divider />}>
          {options.slice(0, visibleCount).map((place) => (
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
          <AppInfiniteScrollTrigger key={visibleCount} root={scrollRoot} rootMargin="48px"
            enabled={Boolean(scrollRoot) && !disabled}
            hasMore={options.length > visibleCount}
            onLoadMore={() => setPage((current) => ({ key: resultKey,
              count: Math.min((current.key === resultKey ? current.count : 6) + 6, options.length) }))} />
        </Box>
      ) : <AppEmptyState compact title={j('empty')} />}
    </Stack>
  );
};
export default ActivityDiscovery;
