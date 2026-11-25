'use client';

import type { ApiResponse } from '@/base/api';
import { useMutationPost } from '@/base/hooks';

export default function usePasswordRecovery() {
  const send = useMutationPost<ApiResponse<null>, { email: string }>({
    mutationKey: ['auth', 'forgot-password'], endPoint: '/auth/forgot-password',
  });
  const verify = useMutationPost<ApiResponse<null>, { email: string; otp: string }>({
    mutationKey: ['auth', 'verify-reset-code'], endPoint: '/auth/verify-reset-code',
  });
  const reset = useMutationPost<ApiResponse<null>, { newPassword: string }>({
    mutationKey: ['auth', 'reset-password'], endPoint: '/auth/reset-password',
  });
  return { send, verify, reset };
}
