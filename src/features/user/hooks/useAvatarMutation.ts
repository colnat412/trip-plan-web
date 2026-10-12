'use client';

import { useRef } from 'react';
import { axiosDelete, axiosPatch, type ApiResponse } from '@/base/api';
import { useMutationRequest, useUploadFile } from '@/base/hooks';
import type { UserProfile } from '@/features/auth/types';

const useAvatarMutation = () => {
  const upload = useUploadFile();
  const pendingUpload = useRef<{ file: File; uploadId: string } | null>(null);
  return useMutationRequest<ApiResponse<UserProfile>, File | null>({
    mutationKey: ['user', 'avatar'],
    mutationFn: async (file) => {
      if (file === null)
        return axiosDelete<ApiResponse<UserProfile>>(
          '/users/me/avatar',
          undefined,
        );
      if (pendingUpload.current?.file !== file) {
        const response = await upload.mutateAsync({
          file,
          purpose: 'PROFILE_AVATAR',
        });
        pendingUpload.current = { file, uploadId: response.data.uploadId };
      }
      return axiosPatch<ApiResponse<UserProfile>>('/users/me/avatar', {
        uploadId: pendingUpload.current.uploadId,
      });
    },
  });
};
export default useAvatarMutation;
