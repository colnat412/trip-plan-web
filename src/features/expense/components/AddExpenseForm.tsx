'use client';

import { useUserContext } from '@/features/user/context/UserContext';
import useDialogDraft from '@/base/hooks/use-dialog-draft';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { getZonedDateTime } from '@/base/utils';
import type { TripMember } from '@/features/trip/types/member.types';
import type {
  AddExpenseInitialData,
  CreateExpensePayload,
  ExpenseCategory,
  SplitItemPayload,
  EditableSplitType,
} from '../types';
import ReceiptImageField from './ReceiptImageField';
import ExpenseCategoryPicker from './ExpenseCategoryPicker';
import { expenseFormSx } from './expense-form.styles';
import SplitAllocationSection from './SplitAllocationSection';

export interface AddExpenseFormProps {
  tripCurrency?: string;
  isLoading?: boolean;
  members?: TripMember[];
  onSubmit: (payload: CreateExpensePayload) => void;
  formId: string;
  onValidityChange?: (valid: boolean) => void;
  initialData?: AddExpenseInitialData;
}

const AddExpenseForm = ({
  tripCurrency = 'VND',
  isLoading = false,
  members = [],
  onSubmit,
  formId,
  onValidityChange,
  initialData,
}: AddExpenseFormProps) => {
  const tForm = useTranslations('expense.form');
  const { user } = useUserContext();
  const tSplits = useTranslations('expense.splits.options');

  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(
    initialData?.amount != null && initialData.amount > 0
      ? String(initialData.amount)
      : '',
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    normalizeTripCategory(initialData?.category || 'FOOD_BEVERAGE'),
  );
  const [createdDateTime] = useState(() => getZonedDateTime(new Date()));
  const [expenseTime, setExpenseTime] = useState(
    initialData?.expenseTime || `${createdDateTime.date}T${createdDateTime.time}:00`,
  );

  const [splitType, setSplitType] = useState<EditableSplitType>('EQUAL');
  const [payerId, setPayerId] = useState<string | number | ''>(() => {
    return members.length > 0 ? members[0].userId : '';
  });
  const selectedPayerId = payerId || members[0]?.userId || '';
  const [receiptFile, setReceiptFile] = useState<File | null | undefined>(
    undefined,
  );
  const [note, setNote] = useState('');

  const splitsRef = useRef<SplitItemPayload[]>([]);
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
    if (members && members.length > 1 && !selectedPayerId) {
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
      currency: tripCurrency,
      expenseTime,
      splitType,
      payerId: selectedPayerId || undefined,
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
              placeholder="0"
              currencySuffix={tripCurrency}
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
            placeholder={tForm('titlePlaceholder')}
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

          {members && members.length > 1 && (
            <AppSelect
              disabled={isLoading}
              label={tForm('payerLabel')}
              renderValue={(value) => {
                const member = members.find((item) => String(item.userId) === String(value));
                return user?.id != null && String(user.id) === String(value) ? tForm('iPay') : member?.name || member?.email || String(value);
              }}
              value={selectedPayerId}
              options={members.map((m) => ({
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

          {members && members.length > 0 && (
            <SplitAllocationSection
              disabled={isLoading}
              splitType={splitType}
              totalAmount={Number(amount) || 0}
              currency={tripCurrency}
              members={members}
              payerId={selectedPayerId}
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

          <ReceiptImageField file={receiptFile} disabled={isLoading} onChange={setReceiptFile} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddExpenseForm;
