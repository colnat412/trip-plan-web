'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Box, Checkbox, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { AppButton, AppNumberInput } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import { getUserInitials } from '@/base/utils/user';
import type { SplitItemPayload, SplitType } from '../types';

export interface SplitMember {
  userId: string | number;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface SplitAllocationSectionProps {
  splitType: SplitType;
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
  splitValue?: number;
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
        custom?.selected !== undefined ? custom.selected : true;
      const amount =
        custom?.amount !== undefined
          ? custom.amount
          : (initial?.allocatedAmount ?? 0);
      const splitValue =
        custom?.splitValue !== undefined
          ? custom.splitValue
          : (initial?.splitValue ?? (splitType === 'PERCENTAGE' ? 0 : 1));

      return {
        member: m,
        selected: isSelected,
        amount,
        splitValue,
      };
    });
  }, [members, customAllocations, initialSplits, splitType]);

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

      if (splitType === 'PERCENTAGE') {
        const sumPct = selectedMembers.reduce(
          (acc, m) => acc + (m.splitValue || 0),
          0,
        );
        const remPct = 100 - sumPct;
        const valid = Math.abs(remPct) < 0.01;

        const splits: SplitItemPayload[] = selectedMembers.map((m) => {
          const pct = m.splitValue || 0;
          const allocated = Math.floor(((totalAmount * pct) / 100) * 100) / 100;
          return {
            userId: m.member.userId,
            splitValue: pct,
            allocatedAmount: allocated,
          };
        });

        return {
          allocatedSum: sumPct,
          remaining: remPct,
          isValid: valid,
          errorMessage: valid
            ? undefined
            : t('form.errors.splitErrorPercent', { sum: String(sumPct) }),
          generatedSplits: splits,
        };
      }

      if (splitType === 'SHARE') {
        const totalShares = selectedMembers.reduce(
          (acc, m) => acc + (m.splitValue > 0 ? m.splitValue : 0),
          0,
        );
        const hasInvalidShare = selectedMembers.some((m) => m.splitValue <= 0);

        const splits: SplitItemPayload[] = selectedMembers.map((m) => {
          const share = m.splitValue > 0 ? m.splitValue : 1;
          const allocated =
            totalShares > 0
              ? Math.floor(((totalAmount * share) / totalShares) * 100) / 100
              : 0;
          return {
            userId: m.member.userId,
            splitValue: share,
            allocatedAmount: allocated,
          };
        });

        return {
          allocatedSum: totalShares,
          remaining: 0,
          isValid: !hasInvalidShare && totalShares > 0,
          errorMessage: hasInvalidShare
            ? t('form.errors.splitErrorPositiveShare')
            : undefined,
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

  const handleSplitValueChange = (
    userId: string | number,
    value: number | undefined,
  ) => {
    const key = String(userId);
    setCustomAllocations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        splitValue: value ?? 0,
      },
    }));
  };

  const handleAutoFillRemaining = (targetUserId: string | number) => {
    const key = String(targetUserId);
    if (splitType === 'EXACT_AMOUNT') {
      setCustomAllocations((prev) => {
        const current = memberAllocations.find(
          (m) => String(m.member.userId) === key,
        );
        const currentAmount = current?.amount ?? 0;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            amount: Math.max(0, currentAmount + remaining),
          },
        };
      });
    } else if (splitType === 'PERCENTAGE') {
      setCustomAllocations((prev) => {
        const current = memberAllocations.find(
          (m) => String(m.member.userId) === key,
        );
        const currentPct = current?.splitValue ?? 0;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            splitValue: Math.max(0, currentPct + remaining),
          },
        };
      });
    }
  };

  if (members.length === 0) {
    return null;
  }

  const hasAmount = Number.isFinite(totalAmount) && totalAmount > 0;
  const allSelected = selectedCount === members.length;
  const canFillRemaining =
    hasAmount &&
    selectedCount > 0 &&
    Math.abs(remaining) >= 0.01 &&
    (splitType === 'EXACT_AMOUNT' || splitType === 'PERCENTAGE');

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

  const allocationStatus = () => {
    if (splitType === 'EQUAL') {
      return t('form.equalSummary', { count: selectedCount });
    }
    if (splitType === 'SHARE') {
      return t('form.totalShares', { count: allocatedSum });
    }
    if (isValid) return t('form.allocationComplete');
    const value =
      splitType === 'PERCENTAGE'
        ? `${Math.abs(remaining)}%`
        : formatCurrency(Math.abs(remaining), currency);
    return t(remaining < 0 ? 'form.overAllocated' : 'form.leftToSplit', {
      amount: value,
    });
  };

  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
      {/* <Stack spacing={1} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', minWidth: 0 }}>
        <Stack direction="row" spacing={1} useFlexGap sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            {t('form.splitTotal')}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, overflowWrap: 'anywhere', minWidth: 0 }}>
            {hasAmount ? formatCurrency(totalAmount, currency) : '—'}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          aria-live="polite"
          sx={{ color: !hasAmount ? 'text.secondary' : isValid ? 'text.secondary' : 'error.main' }}
        >
          {!hasAmount ? t('form.enterAmountToSplit') : allocationStatus()}
        </Typography>
      </Stack> */}

      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {t('form.splitsTitle')} ({selectedCount}/{members.length})
        </Typography>
        <AppButton
          type="button"
          intent="text"
          size="small"
          disabled={disabled}
          onClick={toggleAllMembers}
          sx={{ minHeight: 44, px: 1 }}
        >
          {t(allSelected ? 'form.deselectAllMembers' : 'form.selectAllMembers')}
        </AppButton>
      </Stack>

      <Stack sx={{ borderTop: 1, borderColor: 'divider' }}>
        {memberAllocations.map(({ member, selected, amount, splitValue }) => {
          const memberLabel =
            member.name || member.email || String(member.userId);
          // Dùng cùng kết quả với payload để số tiền xem trước khớp số tiền gửi đi.
          const allocatedAmount =
            generatedSplits.find(
              (split) => String(split.userId) === String(member.userId),
            )?.allocatedAmount ?? 0;
          const inputLabel =
            splitType === 'EXACT_AMOUNT'
              ? t('form.allocatedAmountLabel')
              : t(
                  splitType === 'PERCENTAGE'
                    ? 'form.percentageInputLabel'
                    : 'form.shareInputLabel',
                );

          return (
            <Stack
              key={String(member.userId)}
              spacing={1.5}
              sx={{
                py: 2,
                borderBottom: 1,
                borderColor: 'divider',
                minWidth: 0,
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: 'center', minWidth: 0 }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', flex: 1, minWidth: 0 }}
                >
                  <Checkbox
                    size="small"
                    checked={selected}
                    disabled={disabled}
                    onChange={() => handleToggleMember(member.userId)}
                    slotProps={{ input: { 'aria-label': memberLabel } }}
                    sx={{ p: 1, width: 44, height: 44, flexShrink: 0 }}
                  />
                  <Avatar
                    src={member.avatarUrl || undefined}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '12px',
                      bgcolor: 'primary.light',
                    }}
                  >
                    {getUserInitials(member.name || member.email)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      noWrap
                      title={memberLabel}
                      sx={{ fontWeight: 600 }}
                    >
                      {memberLabel}
                    </Typography>
                    {member.email && member.name && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        title={member.email}
                        sx={{ display: 'block' }}
                      >
                        {member.email}
                      </Typography>
                    )}
                  </Box>
                </Stack>
                <Box sx={{ maxWidth: '45%', minWidth: 0, textAlign: 'right' }}>
                  {selected ? (
                    <>
                      <Typography variant="caption" color="text.secondary">
                        {t('form.allocatedAmountLabel')}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}
                      >
                        {hasAmount
                          ? formatCurrency(allocatedAmount, currency)
                          : '—'}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      {t('form.notSharing')}
                    </Typography>
                  )}
                </Box>
              </Stack>

              {selected && splitType !== 'EQUAL' && (
                <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                  <AppNumberInput
                    fullWidth
                    disabled={disabled}
                    label={inputLabel}
                    value={splitType === 'EXACT_AMOUNT' ? amount : splitValue}
                    currencySuffix={
                      splitType === 'EXACT_AMOUNT'
                        ? currency
                        : splitType === 'PERCENTAGE'
                          ? '%'
                          : t('form.sharesUnit')
                    }
                    onValueChange={(value) =>
                      splitType === 'EXACT_AMOUNT'
                        ? handleAmountChange(member.userId, value)
                        : handleSplitValueChange(member.userId, value)
                    }
                    slotProps={{
                      htmlInput: {
                        'aria-label': `${inputLabel} — ${memberLabel}`,
                        style: { textAlign: 'right', fontSize: '16px' },
                      },
                    }}
                  />
                  {canFillRemaining && (
                    <AppButton
                      type="button"
                      size="small"
                      intent="text"
                      disabled={disabled}
                      onClick={() => handleAutoFillRemaining(member.userId)}
                      sx={{ alignSelf: 'flex-end', minHeight: 44, px: 1 }}
                    >
                      {t('form.autoFillRemaining')}
                    </AppButton>
                  )}
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>

      {errorMessage && (hasAmount || selectedCount === 0) && (
        <Typography variant="caption" role="alert" color="error.main">
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
};

export default SplitAllocationSection;
