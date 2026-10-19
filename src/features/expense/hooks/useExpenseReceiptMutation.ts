'use client';

import { useRef } from 'react';
import { axiosPost, axiosPut, type ApiResponse } from '@/base/api';
import {
  useMutationRequest,
  useUploadFile,
  type MutationCallbacks,
} from '@/base/hooks';
import type { Expense } from '../types';

interface ReceiptPayload {
  receiptFile?: File | null;
  receiptUploadId?: string;
  removeReceipt?: boolean;
  receiptUrl?: string;
}

const useExpenseReceiptMutation = <TPayload extends ReceiptPayload>({
  tripId,
  expenseId,
  method,
  options,
}: {
  tripId: number | string;
  expenseId?: number | string;
  method: 'POST' | 'PUT';
  options?: MutationCallbacks<ApiResponse<Expense>, TPayload>;
}) => {
  const upload = useUploadFile();
  const target = `${tripId}/${expenseId ?? 'new'}`;
  const pendingUpload = useRef<{
    file: File;
    target: string;
    uploadId: string;
  } | null>(null);

  return useMutationRequest<ApiResponse<Expense>, TPayload>({
    mutationKey: [
      'expenses',
      method === 'POST' ? 'create' : 'update',
      tripId,
      expenseId ?? 'new',
    ],
    mutationFn: async ({ receiptFile, ...data }) => {
      const payload: ReceiptPayload = { ...data };
      if (receiptFile) {
        if (
          pendingUpload.current?.file !== receiptFile ||
          pendingUpload.current?.target !== target
        ) {
          const response = await upload.mutateAsync({
            file: receiptFile,
            purpose: 'EXPENSE_RECEIPT',
          });
          pendingUpload.current = {
            file: receiptFile,
            target,
            uploadId: response.data.uploadId,
          };
        }
        payload.receiptUploadId = pendingUpload.current.uploadId;
        if (method === 'PUT') payload.removeReceipt = false;
        delete payload.receiptUrl;
      } else if (receiptFile === null) {
        delete payload.receiptUploadId;
        delete payload.receiptUrl;
        if (method === 'PUT') payload.removeReceipt = true;
      }
      if (method === 'POST') delete payload.removeReceipt;
      const response =
        method === 'POST'
          ? await axiosPost<ApiResponse<Expense>>(
              `/trip/${tripId}/expenses`,
              payload,
            )
          : await axiosPut<ApiResponse<Expense>>(
              `/trip/${tripId}/expenses/${expenseId}`,
              payload,
            );
      pendingUpload.current = null;
      return response;
    },
    options,
  });
};

export default useExpenseReceiptMutation;
