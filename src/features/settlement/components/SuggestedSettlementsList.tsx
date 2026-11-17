'use client';

import { useId, useState } from 'react';
import { Divider, Stack } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppEmptyState } from '@/base/components/ui';
import SuggestedSettlementCard from './SuggestedSettlementCard';
import type { SuggestedSettlement } from '../types';

export interface SuggestedSettlementsListProps {
  suggestedSettlements: SuggestedSettlement[];
  canSettle?: (settlement: SuggestedSettlement) => boolean;
  onSettle: (settlement: SuggestedSettlement) => void;
}

const PREVIEW_COUNT = 3;

const SuggestedSettlementsList = ({ suggestedSettlements, onSettle, canSettle }: SuggestedSettlementsListProps) => {
  const t = useTranslations('settlement');
  const [expanded, setExpanded] = useState(false);
  const listId = useId();

  if (suggestedSettlements.length === 0) {
    return <AppEmptyState compact icon={<CheckCircleRoundedIcon color="success" />} title={t('suggestedEmpty')} />;
  }

  const visible = expanded ? suggestedSettlements : suggestedSettlements.slice(0, PREVIEW_COUNT);
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Stack id={listId} role="list" aria-label={t('suggestedTitle')} divider={<Divider aria-hidden="true" />} sx={{ minWidth: 0 }}>
        {visible.map((item, index) => (
          <SuggestedSettlementCard key={`${item.fromUserId}-${item.toUserId}-${index}`} settlement={item}
            onSettle={canSettle?.(item) === false ? undefined : onSettle} />
        ))}
      </Stack>
      {suggestedSettlements.length > PREVIEW_COUNT && (
        <AppButton intent="text" size="small" aria-expanded={expanded} aria-controls={listId}
          onClick={() => setExpanded(current => !current)} sx={{ alignSelf: 'center', minHeight: 44 }}>
          {expanded ? t('collapseSuggestions') : t('showAllSuggestions', { count: suggestedSettlements.length })}
        </AppButton>
      )}
    </Stack>
  );
};

export default SuggestedSettlementsList;
