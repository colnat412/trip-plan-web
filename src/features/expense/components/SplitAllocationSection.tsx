'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Checkbox, Divider, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { useUserContext } from '@/features/user/context/UserContext';
import { AppButton, AppNumberInput } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { SplitItemPayload, EditableSplitType } from '../types';
import ExpensePayerBadge from './ExpensePayerBadge';

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
  payerId?: string | number;
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
  payerId,
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

  const status = selectedCount === 0
    ? errorMessage
    : !hasAmount
    ? t('form.enterAmountToSplit')
    : splitType === 'EQUAL'
      ? t.rich('form.equalSummary', {
          count: selectedCount,
          amount: formatCurrency(generatedSplits[0]?.allocatedAmount ?? 0, currency),
          highlight: (chunks) => (
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
              {chunks}
            </Box>
          ),
        })
      : isValid
        ? t('form.allocationComplete', { amount: formatCurrency(allocatedSum, currency) })
        : t('form.allocationProgress', {
            allocated: t('form.allocatedTotalLabel', { amount: formatCurrency(allocatedSum, currency) }),
            status: t(remaining < 0 ? 'form.overAllocated' : 'form.leftToSplit', { amount: formatCurrency(Math.abs(remaining), currency) }),
          });

  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {t('form.splitsTitle')} ({selectedCount}/{members.length})
        </Typography>
        <AppButton type="button" intent="text" size="small" disabled={disabled} onClick={toggleAllMembers} sx={{ minHeight: 44, px: 0.5 }}>
          {t(allSelected ? 'form.deselectAllMembers' : 'form.selectAllMembers')}
        </AppButton>
      </Stack>

      {splitType === 'EQUAL' ? (
        <Stack direction="row" useFlexGap sx={{ gap: 1, flexWrap: 'wrap', minWidth: 0 }}>
          {memberAllocations.map(({ member, selected }) => {
            const name = member.name || member.email || String(member.userId);
            const label = user?.id != null && String(user.id) === String(member.userId) ? t('form.you') : name;
            return (
              <Box key={String(member.userId)} component="label" sx={(theme) => ({
                display: 'flex', alignItems: 'center', minHeight: 44, maxWidth: '100%', minWidth: 0,
                pr: 1.5, border: 1, borderRadius: 'var(--app-radius-control)',
                borderColor: selected ? 'primary.main' : 'divider',
                bgcolor: selected
                  ? `color-mix(in srgb, ${(theme.vars?.palette ?? theme.palette).primary.main} 6%, ${(theme.vars?.palette ?? theme.palette).background.paper})`
                  : 'background.paper',
                cursor: disabled ? 'default' : 'pointer',
                '&:focus-within': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
              })}>
                <Checkbox checked={selected} disabled={disabled} onChange={() => handleToggleMember(member.userId)}
                  slotProps={{ input: { 'aria-label': name } }} sx={{ width: 44, height: 44, p: 1, flexShrink: 0 }} />
                <Stack direction="row" useFlexGap sx={{ alignItems: 'center', gap: 0.75, flexWrap: 'wrap', minWidth: 0 }}>
                  <Typography variant="body2" title={name} sx={{ fontWeight: 600, overflowWrap: 'anywhere', minWidth: 0 }}>{label}</Typography>
                  {payerId != null && String(payerId) === String(member.userId) && <ExpensePayerBadge />}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      ) : <Stack divider={<Divider />} sx={{ border: 1, borderColor: 'divider', borderRadius: 'var(--app-radius-control)', bgcolor: 'background.paper' }}>
        {memberAllocations.map(({ member, selected, amount }) => {
          const name = member.name || member.email || String(member.userId);
          const label = user?.id != null && String(user.id) === String(member.userId) ? t('form.you') : name;
          return (
            <Stack key={String(member.userId)} direction="row" useFlexGap sx={{ py: 0.5, px: 1, minHeight: 52, alignItems: 'center', minWidth: 0, columnGap: 1, rowGap: 0.5, flexWrap: 'wrap' }}>
              <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: '1 1 104px', minWidth: 0, minHeight: 44, cursor: disabled ? 'default' : 'pointer' }}>
                <Checkbox checked={selected} disabled={disabled} onChange={() => handleToggleMember(member.userId)}
                  slotProps={{ input: { 'aria-label': name } }} sx={{ width: 44, height: 44, p: 1, flexShrink: 0 }} />
                <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap title={name} sx={{ fontWeight: 600 }}>{label}</Typography>
                  <Stack direction="row" useFlexGap sx={{ gap: 0.75, alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
                    {payerId != null && String(payerId) === String(member.userId) && (
                      <ExpensePayerBadge />
                    )}
                  </Stack>
                </Stack>
              </Box>
              {!selected ? (
                <Typography variant="body2" color="text.disabled" sx={{ flexShrink: 0 }}>
                  —
                </Typography>
              ) : <AppNumberInput data-expense-share-input disabled={disabled} emphasis="compact"
                currencySuffix={currency}
                value={amount} allowDecimals={currency !== 'VND' || !Number.isInteger(amount)}
                onValueChange={(value) => handleAmountChange(member.userId, value)}
                slotProps={{ htmlInput: { 'aria-label': `${t('form.allocatedAmountLabel')} (${currency}) — ${name}` } }}
                sx={{
                  width: { xs: 192, sm: 224 }, flex: '1 1 192px', maxWidth: { xs: '100%', sm: 240 }, minWidth: 0,
                }} />}
            </Stack>
          );
        })}
      </Stack>}
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography variant="caption" role={selectedCount === 0 ? 'alert' : 'status'}
          sx={{ color: selectedCount === 0 || (hasAmount && !isValid) ? 'error.main' : 'text.secondary', overflowWrap: 'anywhere' }}>
          {status}
        </Typography>
        {canFillRemaining && (
          <AppButton intent="text" size="small" disabled={disabled}
            onClick={() => handleAutoFillRemaining(selectedMembers[selectedMembers.length - 1].member.userId)}
            sx={{ alignSelf: 'flex-end', minHeight: 44 }}>
            {t('form.fillRemainingFor', { name: selectedMembers[selectedMembers.length - 1].member.name || selectedMembers[selectedMembers.length - 1].member.email || String(selectedMembers[selectedMembers.length - 1].member.userId) })}
          </AppButton>
        )}
      </Stack>
    </Stack>
  );
};

export default SplitAllocationSection;
