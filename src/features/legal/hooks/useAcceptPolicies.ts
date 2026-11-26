'use client';

import { useMutationPost } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import type { UserProfile } from '@/features/auth/types';

interface AcceptancePayload {
  termsAccepted: boolean;
  contentAccepted: boolean;
  privacyAccepted: boolean;
  version: string;
  locale: string;
}

export default function useAcceptPolicies() {
  return useMutationPost<ApiResponse<UserProfile>, AcceptancePayload>({
    mutationKey: ['user', 'policies', 'accept'], endPoint: '/users/me/policies/accept',
  });
}
