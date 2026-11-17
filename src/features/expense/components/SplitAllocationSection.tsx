'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Checkbox, Divider, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useUserContext } from '@/features/user/context/UserContext';
import { AppButton, AppNumberInput, AppFilterChip } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { SplitItemPayload, EditableSplitType } from '../types';

export interface SplitMember {
  userId: string | number;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface SplitAllocationSectionProps {
  splitType: EditableSplitType;
  disabled?: boolean;
  totalAmount: number;
  currency: string;
  members: SplitMember[];
  initialSplits?: SplitItemPayload[];
  onChange: (
    splits: SplitItemPayload[],
    isValid: boolean,
    errorMessage?: string,
  ) => void;
}

interface CustomAllocation {
  selected?: boolean;
  amount?: number;
}

const SplitAllocationSection = ({
  splitType,
  disabled = false,
  totalAmount,
  currency,
  members,
  initialSplits = [],
  onChange,
}: SplitAllocationSectionProps) => {
  const t = useTranslations('expense');
  const { user } = useUserContext();

  const [customAllocations, setCustomAllocations] = useState<
    Record<string, CustomAllocation>
  >({});

  const memberAllocations = useMemo(() => {
    return members.map((m) => {
      const key = String(m.userId);
      const custom = customAllocations[key];
      const initial = initialSplits.find(
        (s) => String(s.userId) === String(m.userId),
      );

      const isSelected =
        custom?.selected !== undefined ? custom.selected : initialSplits.length === 0 || Boolean(initial);
      const amount =
        custom?.amount !== undefined
          ? custom.amount
          : (initial?.allocatedAmount ?? 0);
      return {
        member: m,
        selected: isSelected,
        amount,
      };
    });
  }, [members, customAllocations, initialSplits]);

  const selectedMembers = useMemo(
    () => memberAllocations.filter((s) => s.selected),
    [memberAllocations],
  );
  const selectedCount = selectedMembers.length;

  const { allocatedSum, remaining, isValid, errorMessage, generatedSplits } =
    useMemo(() => {
      if (selectedCount === 0) {
        return {
          allocatedSum: 0,
          remaining: totalAmount,
          isValid: false,
          errorMessage: t('form.errors.splitErrorNoMembers'),
          generatedSplits: [],
        };
      }

      if (splitType === 'EQUAL') {
        const baseShare = Math.floor((totalAmount / selectedCount) * 100) / 100;
        const splits: SplitItemPayload[] = selectedMembers.map((m) => ({
          userId: m.member.userId,
          allocatedAmount: baseShare,
          splitValue: 1,
        }));

        return {
          allocatedSum: totalAmount,
          remaining: 0,
          isValid: true,
          generatedSplits: splits,
        };
      }

      if (splitType === 'EXACT_AMOUNT') {
        const sum = selectedMembers.reduce(
          (acc, m) => acc + (m.amount || 0),
          0,
        );
        const rem = totalAmount - sum;
        const valid = Math.abs(rem) < 0.01;

        const splits: SplitItemPayload[] = selectedMembers.map((m) => ({
          userId: m.member.userId,
          allocatedAmount: m.amount || 0,
          splitValue: m.amount || 0,
        }));

        return {
          allocatedSum: sum,
          remaining: rem,
          isValid: valid,
          errorMessage: valid
            ? undefined
            : t('form.errors.splitErrorExact', {
                sum: formatCurrency(sum, currency),
                total: formatCurrency(totalAmount, currency),
              }),
          generatedSplits: splits,
        };
      }

      return {
        allocatedSum: 0,
        remaining: 0,
        isValid: true,
        generatedSplits: [],
      };
    }, [selectedCount, selectedMembers, splitType, totalAmount, currency, t]);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const prevPayloadRef = useRef<string>('');

  useEffect(() => {
    const payload = JSON.stringify({
      splits: generatedSplits,
      isValid,
      errorMessage,
    });
    if (payload !== prevPayloadRef.current) {
      prevPayloadRef.current = payload;
      onChangeRef.current?.(generatedSplits, isValid, errorMessage);
    }
  }, [generatedSplits, isValid, errorMessage]);

  // Toggle checkbox chọn thành viên
  const handleToggleMember = (userId: string | number) => {
    const key = String(userId);
    setCustomAllocations((prev) => {
      const current = memberAllocations.find(
        (m) => String(m.member.userId) === key,
      );
      const currentSelected = current?.selected ?? true;
      return {
        ...prev,
        [key]: {
          ...prev[key],
          selected: !currentSelected,
        },
      };
    });
  };

  const handleAmountChange = (
    userId: string | number,
    value: number | undefined,
  ) => {
    const key = String(userId);
    setCustomAllocations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        amount: value ?? 0,
      },
    }));
  };

  const handleAutoFillRemaining = (targetUserId: string | number) => {
    const key = String(targetUserId);
    setCustomAllocations((previous) => {
      const current = memberAllocations.find(item => String(item.member.userId) === key);
      return {
        ...previous,
        [key]: { ...previous[key], amount: Math.max(0, (current?.amount ?? 0) + remaining) },
      };
    });
  };

  if (members.length === 0) {
    return null;
  }

  const hasAmount = Number.isFinite(totalAmount) && totalAmount > 0;
  const allSelected = selectedCount === members.length;
  const canFillRemaining = hasAmount && selectedCount > 0 && remaining >= 0.01 && splitType === 'EXACT_AMOUNT';

  const toggleAllMembers = () => {
    setCustomAllocations((previous) => {
      const next = { ...previous };
      for (const member of members) {
        const key = String(member.userId);
        next[key] = { ...next[key], selected: !allSelected };
      }
      return next;
    });
  };

  const status = !hasAmount
    ? t('form.enterAmountToSplit')
    : splitType === 'EQUAL'
      ? t('form.equalSummary', { count: selectedCount })
      : isValid
        ? t('form.allocationComplete')
        : t(remaining < 0 ? 'form.overAllocated' : 'form.leftToSplit', { amount: formatCurrency(Math.abs(remaining), currency) });

  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {t('form.splitsTitle')} ({selectedCount}/{members.length})
        </Typography>
        <AppButton type="button" intent="text" size="small" disabled={disabled} onClick={toggleAllMembers} sx={{ minHeight: 44, px: 0.5 }}>
          {t(allSelected ? 'form.deselectAllMembers' : 'form.selectAllMembers')}
        </AppButton>
      </Stack>

      {splitType === 'EQUAL' ? (
        <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1 }}>
          {memberAllocations.map(({ member, selected }) => {
            const name = member.name || member.email || String(member.userId);
            const label = user?.id != null && String(user.id) === String(member.userId) ? t('form.you') : name;
            return (
              <AppFilterChip key={String(member.userId)} label={label} title={name}
                icon={selected ? <CheckRoundedIcon /> : <AddRoundedIcon />}
                selected={selected} disabled={disabled} onClick={() => handleToggleMember(member.userId)}
                sx={{ borderRadius: 'var(--app-radius-pill)', maxWidth: '100%', '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }} />
            );
          })}
        </Stack>
      ) : (
        <Stack divider={<Divider />}>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right', pb: 1 }}>
            {t('form.allocatedAmountLabel')} ({currency})
          </Typography>
          {memberAllocations.map(({ member, selected, amount }) => {
            const name = member.name || member.email || String(member.userId);
            const label = user?.id != null && String(user.id) === String(member.userId) ? t('form.you') : name;
            return (
              <Stack key={String(member.userId)} direction="row" spacing={1} sx={{ py: 1.25, alignItems: 'center', minWidth: 0 }}>
                <Checkbox checked={selected} disabled={disabled} onChange={() => handleToggleMember(member.userId)}
                  slotProps={{ input: { 'aria-label': name } }} sx={{ width: 44, height: 44, p: 1, flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap title={name} sx={{ fontWeight: 600 }}>{label}</Typography>
                  {!selected && <Typography variant="caption" color="text.secondary">{t('form.notSharing')}</Typography>}
                </Box>
                <AppNumberInput disabled={disabled || !selected} size="small" variant="standard"
                  value={amount} placeholder="0" allowDecimals={currency !== 'VND' || !Number.isInteger(amount)}
                  onValueChange={(value) => handleAmountChange(member.userId, value)}
                  slotProps={{ htmlInput: { 'aria-label': `${t('form.allocatedAmountLabel')} — ${name}`, style: { textAlign: 'right' } } }}
                  sx={{ width: { xs: 120, sm: 168 }, flexShrink: 0, '& .MuiInputBase-input': { fontSize: '16px', py: 1, fontWeight: 600, fontVariantNumeric: 'tabular-nums' } }} />
              </Stack>
            );
          })}
          <Stack direction="row" useFlexGap sx={{ justifyContent: 'space-between', gap: 1, pt: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="caption" color="text.secondary">{currency}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t('form.allocatedTotalLabel', { amount: formatCurrency(allocatedSum, currency) })}
            </Typography>
          </Stack>
          {canFillRemaining && (
            <AppButton intent="text" size="small" disabled={disabled}
              onClick={() => handleAutoFillRemaining(selectedMembers[selectedMembers.length - 1].member.userId)}
              sx={{ alignSelf: 'flex-end', minHeight: 44 }}>
              {t('form.fillRemainingFor', { name: selectedMembers[selectedMembers.length - 1].member.name || selectedMembers[selectedMembers.length - 1].member.email || String(selectedMembers[selectedMembers.length - 1].member.userId) })}
            </AppButton>
          )}
        </Stack>
      )}
      <Typography variant="caption" aria-live="polite" sx={{ color: hasAmount && !isValid ? 'error.main' : 'text.secondary' }}>
        {status}
      </Typography>
      {selectedCount === 0 && <Typography variant="caption" role="alert" color="error.main">{errorMessage}</Typography>}
    </Stack>
  );
};

export default SplitAllocationSection;
