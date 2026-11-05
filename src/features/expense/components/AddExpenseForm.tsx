'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  AppDatePicker,
  AppNumberInput,
  AppTextField,
  AppSelect,
  type AppSelectOption,
} from '@/base/components/ui';
import { getCategorySelectOptions, normalizeTripCategory } from '@/base/constants';
import type { TripMember } from '@/features/trip/types/member.types';
import ReceiptScanBanner from './ReceiptScanBanner';
import type {
  AddExpenseInitialData,
  CreateExpensePayload,
  ExpenseCategory,
  ReceiptItem,
  ScannedReceipt,
  SplitItemPayload,
  SplitType,
} from '../types';
import ReceiptImageField from './ReceiptImageField';
import SplitAllocationSection from './SplitAllocationSection';

export interface AddExpenseFormProps {
  tripCurrency?: string;
  isLoading?: boolean;
  members?: TripMember[];
  onSubmit: (payload: CreateExpensePayload) => void;
  formId: string;
  initialData?: AddExpenseInitialData;
}

const AddExpenseForm = ({
  tripCurrency = 'VND',
  isLoading = false,
  members = [],
  onSubmit,
  formId,
  initialData,
}: AddExpenseFormProps) => {
  const tForm = useTranslations('expense.form');
  const tCat = useTranslations('expense.categories');
  const tSplits = useTranslations('expense.splits.options');

  const categoryOptions: AppSelectOption[] = useMemo(
    () => getCategorySelectOptions(tCat),
    [tCat],
  );

  const splitOptions: AppSelectOption[] = useMemo(
    () => [
      { value: 'EQUAL', label: tSplits('EQUAL') },
      { value: 'EXACT_AMOUNT', label: tSplits('EXACT_AMOUNT') },
      { value: 'PERCENTAGE', label: tSplits('PERCENTAGE') },
      { value: 'SHARE', label: tSplits('SHARE') },
    ],
    [tSplits],
  );

  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(
    initialData?.amount != null && initialData.amount > 0
      ? String(initialData.amount)
      : '',
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    normalizeTripCategory(initialData?.category || 'FOOD_BEVERAGE'),
  );
  const [expenseDate, setExpenseDate] = useState(
    initialData?.expenseDate || new Date().toISOString().split('T')[0],
  );

  const [splitType, setSplitType] = useState<SplitType>('EQUAL');
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

  const handleSplitChange = useCallback(
    (newSplits: SplitItemPayload[], valid: boolean) => {
      splitsRef.current = newSplits;
      isSplitValidRef.current = valid;
    },
    [],
  );

  const handleScanSuccess = (scanned: ScannedReceipt, sourceImage?: File) => {
    if (sourceImage) setReceiptFile(sourceImage);
    if (scanned.merchant_name) {
      setTitle(scanned.merchant_name);
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
    if (scanned.amount != null && scanned.amount > 0) {
      setAmount(String(scanned.amount));
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
    if (scanned.category) {
      setCategory(scanned.category);
    }
    if (scanned.expense_date) {
      setExpenseDate(scanned.expense_date);
      setErrors((prev) => ({ ...prev, expenseDate: undefined }));
    }
    if (scanned.raw_text) {
      setNote(scanned.raw_text);
    } else if (scanned.items && scanned.items.length > 0) {
      setNote(
        scanned.items
          .map((i: ReceiptItem) => `${i.name} (x${i.quantity || 1})`)
          .join(', '),
      );
    }
  };

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
    if (members && members.length > 1 && !selectedPayerId) {
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
      currency: tripCurrency,
      expenseDate,
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
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}
    >
      <ReceiptScanBanner
        onScanSuccess={handleScanSuccess}
        disabled={isLoading}
      />

      <Stack component="fieldset" disabled={isLoading} spacing={2.5}
        sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        <Stack component="section" aria-label={tForm('detailsSection')} spacing={2.5}>
          <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 700 }}>
            {tForm('detailsSection')}
          </Typography>
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

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppNumberInput
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

          {members && members.length > 1 && (
            <AppSelect
              disabled={isLoading}
              label={tForm('payerLabel')}
              renderValue={(value) => {
                const member = members.find((item) => String(item.userId) === String(value));
                return member?.name || member?.email || String(value);
              }}
              value={selectedPayerId}
              options={members.map((m) => ({
                value: m.userId,
                label: m.name && m.email ? `${m.name} (${m.email})` : m.name || m.email || String(m.userId),
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

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppSelect
              disabled={isLoading}
              label={tForm('splitTypeLabel')}
              value={splitType}
              options={splitOptions}
              onChange={(e) => setSplitType(e.target.value as SplitType)}
            />
          </Box>

          {members && members.length > 0 && (
            <SplitAllocationSection
              disabled={isLoading}
              splitType={splitType}
              totalAmount={Number(amount) || 0}
              currency={tripCurrency}
              members={members}
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

          <ReceiptImageField file={receiptFile} disabled={isLoading} onChange={setReceiptFile} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddExpenseForm;
