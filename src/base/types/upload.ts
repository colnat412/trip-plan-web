export type UploadPurpose = 'PROFILE_AVATAR' | 'TRIP_COVER' | 'EXPENSE_RECEIPT';
export interface UploadedImage {
  uploadId: string;
  url: string;
  purpose: UploadPurpose;
}
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
