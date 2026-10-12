'use client';

import type { ApiResponse } from '@/base/api';
import type { UploadedImage, UploadPurpose } from '@/base/types';
import useMutationPost from './use-mutation-post';

const useUploadFile = () =>
  useMutationPost<
    ApiResponse<UploadedImage>,
    { file: File; purpose: UploadPurpose }
  >({
    mutationKey: ['uploads'],
    endPoint: '/uploads',
    getPayload: (_endpoint, { file, purpose }) => {
      const form = new FormData();
      form.append('file', file);
      form.append('purpose', purpose);
      return form;
    },
    // Remove the JSON default; the browser supplies the multipart boundary.
    config: { headers: { 'Content-Type': undefined }, timeout: 90_000 },
  });
export default useUploadFile;
