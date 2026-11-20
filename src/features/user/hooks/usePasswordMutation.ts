'use client';

import { axiosPatch, type ApiResponse } from '@/base/api';
import { useMutationRequest } from '@/base/hooks';
import type { UserProfile } from '@/features/auth/types';

export interface UpdatePasswordPayload {
  currentPassword?: string;
  newPassword: string;
}

const usePasswordMutation = () =>
  useMutationRequest<ApiResponse<UserProfile>, UpdatePasswordPayload>({
    mutationKey: ['user', 'password'],
    mutationFn: data => axiosPatch<ApiResponse<UserProfile>>('/users/me/password', data),
  });

export default usePasswordMutation;
