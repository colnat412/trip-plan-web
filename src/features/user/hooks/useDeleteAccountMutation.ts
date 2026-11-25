'use client';

import { axiosDelete, type ApiResponse } from '@/base/api';
import { useMutationRequest } from '@/base/hooks';

export interface DeleteAccountPayload { confirmed: true; }

export default function useDeleteAccountMutation() {
  return useMutationRequest<ApiResponse<null>, DeleteAccountPayload>({
    mutationKey: ['user', 'delete-account'],
    mutationFn: data => axiosDelete<ApiResponse<null>>('/users/me', data),
  });
}
