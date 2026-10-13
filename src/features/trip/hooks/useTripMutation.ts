'use client';

import { useRef } from 'react';
import { axiosPut, type ApiResponse } from '@/base/api';
import {
  useMutationPost,
  useMutationRequest,
  useUploadFile,
  useMutationPut,
  type MutationCallbacks,
} from '@/base/hooks';
import { tripMutationKeys } from '../constants/trip-keys';
import type { CreateTripPayload, Trip, UpdateTripPayload } from '../types';

type UpdateTripWithCoverPayload = UpdateTripPayload & {
  coverFile?: File | null;
};

export interface UseUpdateTripParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<Trip>, UpdateTripWithCoverPayload>;
}

export interface UseDeleteTripParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export function useCreateTrip(
  options?: MutationCallbacks<ApiResponse<Trip>, CreateTripPayload>,
) {
  const createMutation = useMutationPost<ApiResponse<Trip>, CreateTripPayload>({
    mutationKey: tripMutationKeys.create,
    endPoint: '/trip/create',
    options,
  });

  return {
    ...createMutation,
    createMutation,
    createTrip: createMutation.mutate,
    createTripAsync: createMutation.mutateAsync,
  };
}

export function useUpdateTrip({ tripId, options }: UseUpdateTripParams) {
  const upload = useUploadFile();
  const pendingUpload = useRef<{
    file: File;
    tripId: number | string;
    uploadId: string;
  } | null>(null);
  const updateMutation = useMutationRequest<
    ApiResponse<Trip>,
    UpdateTripWithCoverPayload
  >({
    mutationKey: tripMutationKeys.update(tripId),
    mutationFn: async ({ coverFile, ...payload }) => {
      if (coverFile) {
        if (
          pendingUpload.current?.file !== coverFile ||
          pendingUpload.current?.tripId !== tripId
        ) {
          const response = await upload.mutateAsync({
            file: coverFile,
            purpose: 'TRIP_COVER',
          });
          pendingUpload.current = {
            file: coverFile,
            tripId,
            uploadId: response.data.uploadId,
          };
        }
        payload.coverUploadId = pendingUpload.current.uploadId;
        payload.removeCover = false;
      } else if (coverFile === null) {
        payload.removeCover = true;
      }
      // Keep the uploadID on failure so Save can retry without uploading again.
      const response = await axiosPut<ApiResponse<Trip>>(
        `/trip/${tripId}`,
        payload,
      );
      pendingUpload.current = null;
      return response;
    },
    options,
  });

  return {
    ...updateMutation,
    updateMutation,
    updateTrip: updateMutation.mutate,
    updateTripAsync: updateMutation.mutateAsync,
  };
}

export function useDeleteTrip({ tripId, options }: UseDeleteTripParams) {
  const deleteMutation = useMutationPut<
    ApiResponse<null>,
    Record<string, never>
  >({
    mutationKey: tripMutationKeys.delete(tripId),
    endPoint: `/trip/delete/${tripId}`,
    options,
  });

  return {
    ...deleteMutation,
    deleteMutation,
    deleteTrip: deleteMutation.mutate,
    deleteTripAsync: deleteMutation.mutateAsync,
  };
}

const useTripMutation = () => {
  return {
    useCreateTrip,
    useUpdateTrip,
    useDeleteTrip,
  };
};

export default useTripMutation;
