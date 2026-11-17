'use client';

import { useUserContext } from '@/features/user/context/UserContext';
import useDialogDraft from '@/base/hooks/use-dialog-draft';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  AppDatePicker,
  AppNumberInput,
  AppTextField,
  AppSelect,
  AppSegmentedControl,
  type AppSelectOption,
} from '@/base/components/ui';
import { getCategorySelectOptions, normalizeTripCategory } from '@/base/constants';
import type {
  Expense,
  ExpenseCategory,
  SplitItemPayload,
  EditableSplitType,
  UpdateExpensePayload,
} from '../types';
import ReceiptImageField from './ReceiptImageField';
import SplitAllocationSection, {
  type SplitMember,
} from './SplitAllocationSection';

export interface EditExpenseFormProps {
  expense: Expense;
  members?: SplitMember[];
  isLoading?: boolean;
  onSubmit: (payload: UpdateExpensePayload) => void;
  formId: string;
}

const EditExpenseForm = ({
  expense,
  members = [],
  isLoading = false,
  onSubmit,
  formId,
}: EditExpenseFormProps) => {
  const tForm = useTranslations('expense.form');
  const { user } = useUserContext();
  const tCat = useTranslations('expense.categories');
  const tSplits = useTranslations('expense.splits.options');

  const categoryOptions: AppSelectOption[] = useMemo(
    () => getCategorySelectOptions(tCat),
    [tCat],
  );

  const allMembers: SplitMember[] = useMemo(() => {
    const result: SplitMember[] = [...members];
    for (const split of expense.splits || []) {
      if (!result.some(member => String(member.userId) === String(split.userId))) {
        result.push({ userId: split.userId, name: split.userName, email: split.userEmail, avatarUrl: split.userAvatarUrl });
      }
    }
    return result;
  }, [members, expense.splits]);

  const initialSplits: SplitItemPayload[] = useMemo(() => {
    return (expense.splits || []).map((s) => ({
      userId: s.userId,
      allocatedAmount: s.allocatedAmount,
      splitValue: s.splitValue,
    }));
  }, [expense.splits]);

  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState<ExpenseCategory>(
    normalizeTripCategory(expense.category),
  );
  const [expenseDate, setExpenseDate] = useState(expense.expenseDate);
  const [splitType, setSplitType] = useState<EditableSplitType>(expense.splitType === 'EQUAL' ? 'EQUAL' : 'EXACT_AMOUNT');
  const [payerId, setPayerId] = useState<string | number | ''>(
    expense.payerId || '',
  );
  const [receiptFile, setReceiptFile] = useState<File | null | undefined>(
    undefined,
  );
  const [note, setNote] = useState(expense.note || '');

  const splitsRef = useRef<SplitItemPayload[]>(initialSplits);
  const isSplitValidRef = useRef<boolean>(true);

  const baselineSplits = useRef<string | undefined>(undefined);
  useDialogDraft(() => ({
    title, amount, category, expenseDate, splitType, payerId, note,
    receipt: receiptFile === undefined ? undefined : receiptFile === null ? null : [receiptFile.name, receiptFile.size, receiptFile.lastModified],
    splitsChanged: baselineSplits.current !== undefined && JSON.stringify(splitsRef.current) !== baselineSplits.current,
  }));

  const handleSplitChange = useCallback(
    (newSplits: SplitItemPayload[], valid: boolean) => {
      baselineSplits.current ??= JSON.stringify(newSplits);
      splitsRef.current = newSplits;
      isSplitValidRef.current = valid;
    },
    [],
  );

  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
    expenseDate?: string;
    payerId?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      title?: string;
      amount?: string;
      expenseDate?: string;
      payerId?: string;
    } = {};
    if (!title.trim()) {
      newErrors.title = tForm('errors.titleRequired');
    }
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = tForm('errors.amountPositive');
    }
    if (!expenseDate || !expenseDate.trim()) {
      newErrors.expenseDate = tForm('errors.dateRequired');
    }
    if (allMembers && allMembers.length > 1 && !payerId) {
      newErrors.payerId = tForm('errors.payerRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && isSplitValidRef.current;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !validate()) return;

    onSubmit({
      title: title.trim(),
      amount: Number(amount),
      category,
      currency: expense.currency,
      expenseDate,
      splitType,
      payerId: payerId ? payerId : undefined,
      receiptFile,
      note: note.trim() || undefined,
      splits: splitsRef.current.length > 0 ? splitsRef.current : undefined,
    });
  };

  return (
    <Box
      id={formId}
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}
    >
      <Stack component="fieldset" disabled={isLoading} spacing={2.5}
        sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        <Stack component="section" aria-label={tForm('detailsSection')} spacing={2.5}>
          <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 700 }}>
            {tForm('detailsSection')}
          </Typography>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppNumberInput
              emphasis="primary"
              disabled={isLoading}
              label={tForm('amountLabel')}
              currencySuffix={expense.currency}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount)
                  setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              error={Boolean(errors.amount)}
              helperText={errors.amount}
            />
          </Box>

          <AppTextField
            disabled={isLoading}
            label={tForm('titleLabel')}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title)
                setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            error={Boolean(errors.title)}
            helperText={errors.title}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <AppDatePicker
                disabled={isLoading}
                label={tForm('dateLabel')}
                value={expenseDate}
                onChange={(value) => {
                  setExpenseDate(value);
                  if (errors.expenseDate) {
                    setErrors((prev) => ({ ...prev, expenseDate: undefined }));
                  }
                }}
                error={Boolean(errors.expenseDate)}
                helperText={errors.expenseDate}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <AppSelect
                disabled={isLoading}
                label={tForm('categoryLabel')}
                value={category}
                options={categoryOptions}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              />
            </Box>
          </Stack>
        </Stack>

        <Stack component="section" aria-label={tForm('sharingSection')} spacing={2.5}
          sx={{ borderTop: 1, borderColor: 'divider', pt: 2.5 }}>
          <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 700 }}>
            {tForm('sharingSection')}
          </Typography>

          {allMembers && allMembers.length > 1 && (
            <AppSelect
              disabled={isLoading}
              label={tForm('payerLabel')}
              renderValue={(value) => {
                const member = allMembers.find((item) => String(item.userId) === String(value));
                return user?.id != null && String(user.id) === String(value) ? tForm('iPay') : member?.name || member?.email || String(value);
              }}
              value={payerId}
              options={allMembers.map((m) => ({
                value: m.userId,
                label: user?.id != null && String(user.id) === String(m.userId) ? tForm('iPay') : m.name && m.email ? `${m.name} (${m.email})` : m.name || m.email || String(m.userId),
              }))}
              onChange={(e) => {
                setPayerId(e.target.value as string | number);
                if (errors.payerId) {
                  setErrors((prev) => ({ ...prev, payerId: undefined }));
                }
              }}
              error={Boolean(errors.payerId)}
              helperText={errors.payerId}
            />
          )}

          <AppSegmentedControl<EditableSplitType>
            label={tForm('splitTypeLabel')}
            disabled={isLoading}
            value={splitType}
            onChange={(value) => { if (!isLoading) setSplitType(value as EditableSplitType); }}
            options={[
              { value: 'EQUAL', label: tSplits('EQUAL') },
              { value: 'EXACT_AMOUNT', label: tSplits('EXACT_AMOUNT') },
            ]}
          />

          {allMembers && allMembers.length > 0 && (
            <SplitAllocationSection
              disabled={isLoading}
              splitType={splitType}
              totalAmount={Number(amount) || 0}
              currency={expense.currency}
              members={allMembers}
              initialSplits={initialSplits}
              onChange={handleSplitChange}
            />
          )}
        </Stack>

        <Stack component="section" aria-label={tForm('extrasSection')} spacing={2.5}
          sx={{ borderTop: 1, borderColor: 'divider', pt: 2.5 }}>
          <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 700 }}>
            {tForm('extrasSection')}
          </Typography>
          <AppTextField
            disabled={isLoading}
            label={tForm('noteLabel')}
            placeholder={tForm('notePlaceholder')}
            multiline
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <ReceiptImageField
            src={expense.receiptUrl}
            disabled={isLoading}
            onChange={setReceiptFile}
          />
        </Stack>

      </Stack>
    </Box>
  );
};

export default EditExpenseForm;
