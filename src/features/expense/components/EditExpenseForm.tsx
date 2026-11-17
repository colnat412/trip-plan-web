'use client';

import { useUserContext } from '@/features/user/context/UserContext';
import useDialogDraft from '@/base/hooks/use-dialog-draft';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  AppDatePicker,
  AppNumberInput,
  AppTextField,
  AppSelect,
  AppSegmentedControl,
} from '@/base/components/ui';
import { normalizeTripCategory } from '@/base/constants';
import type {
  Expense,
  ExpenseCategory,
  SplitItemPayload,
  EditableSplitType,
  UpdateExpensePayload,
} from '../types';
import ReceiptImageField from './ReceiptImageField';
import ExpenseCategoryPicker from './ExpenseCategoryPicker';
import { expenseFormSx } from './expense-form.styles';
import SplitAllocationSection, {
  type SplitMember,
} from './SplitAllocationSection';

export interface EditExpenseFormProps {
  expense: Expense;
  members?: SplitMember[];
  isLoading?: boolean;
  onSubmit: (payload: UpdateExpensePayload) => void;
  formId: string;
  onValidityChange?: (valid: boolean) => void;
}

const EditExpenseForm = ({
  expense,
  members = [],
  isLoading = false,
  onSubmit,
  formId,
  onValidityChange,
}: EditExpenseFormProps) => {
  const tForm = useTranslations('expense.form');
  const { user } = useUserContext();
  const tSplits = useTranslations('expense.splits.options');

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
  const [expenseTime, setExpenseTime] = useState(expense.expenseTime);
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
  const [splitValid, setSplitValid] = useState(true);

  const baselineSplits = useRef<string | undefined>(undefined);
  useDialogDraft(() => ({
    title, amount, category, expenseTime, splitType, payerId, note,
    receipt: receiptFile === undefined ? undefined : receiptFile === null ? null : [receiptFile.name, receiptFile.size, receiptFile.lastModified],
    splitsChanged: baselineSplits.current !== undefined && JSON.stringify(splitsRef.current) !== baselineSplits.current,
  }));

  const handleSplitChange = useCallback(
    (newSplits: SplitItemPayload[], valid: boolean) => {
      baselineSplits.current ??= JSON.stringify(newSplits);
      splitsRef.current = newSplits;
      isSplitValidRef.current = valid;
      setSplitValid(valid);
    },
    [],
  );

  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
    expenseTime?: string;
    payerId?: string;
  }>({});

  const getValidationErrors = () => {
    const newErrors: {
      title?: string;
      amount?: string;
      expenseTime?: string;
      payerId?: string;
    } = {};
    if (!title.trim()) {
      newErrors.title = tForm('errors.titleRequired');
    }
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = tForm('errors.amountPositive');
    }
    if (!expenseTime || !expenseTime.trim()) {
      newErrors.expenseTime = tForm('errors.dateRequired');
    }
    if (allMembers && allMembers.length > 1 && !payerId) {
      newErrors.payerId = tForm('errors.payerRequired');
    }
    return newErrors;
  };

  const isFormValid = Object.keys(getValidationErrors()).length === 0 && splitValid;
  useEffect(() => {
    onValidityChange?.(isFormValid);
  }, [isFormValid, onValidityChange]);

  const validate = () => {
    const nextErrors = getValidationErrors();
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && isSplitValidRef.current;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !validate()) return;

    onSubmit({
      title: title.trim(),
      amount: Number(amount),
      category,
      currency: expense.currency,
      expenseTime,
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
      sx={expenseFormSx}
    >
      <Stack component="fieldset" disabled={isLoading} spacing={3}
        sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        <Stack component="section" aria-label={tForm('detailsSection')} spacing={2.5}>
          <Box data-expense-amount sx={{ minWidth: 0 }}>
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

          <Stack spacing={2.5}>
            <ExpenseCategoryPicker value={category} onChange={setCategory} disabled={isLoading} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <AppDatePicker
                includeTime
                disabled={isLoading}
                label={tForm('dateLabel')}
                value={expenseTime}
                onChange={(value) => {
                  setExpenseTime(value);
                  if (errors.expenseTime) {
                    setErrors((prev) => ({ ...prev, expenseTime: undefined }));
                  }
                }}
                error={Boolean(errors.expenseTime)}
                helperText={errors.expenseTime}
              />
            </Box>

          </Stack>
        </Stack>

        <Stack component="section" aria-label={tForm('sharingSection')} spacing={2}
          sx={{ minWidth: 0 }}>

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
              payerId={payerId}
              initialSplits={initialSplits}
              onChange={handleSplitChange}
            />
          )}
        </Stack>

        <Stack component="section" aria-label={tForm('extrasSection')} spacing={2.5}
          sx={{ minWidth: 0 }}>
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
