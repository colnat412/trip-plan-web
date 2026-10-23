'use client';

import { axiosPatch, type ApiResponse } from '@/base/api';
import { useMutationRequest } from '@/base/hooks';
import type { UserProfile } from '@/features/auth/types';

const useProfileMutation = () =>
  useMutationRequest<ApiResponse<UserProfile>, { name: string }>({
    mutationKey: ['user', 'profile'],
    mutationFn: (data) =>
      axiosPatch<ApiResponse<UserProfile>>('/users/me/profile', data),
  });

export default useProfileMutation;
