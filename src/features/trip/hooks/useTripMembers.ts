'use client';

import { useMemo } from 'react';
import type { ApiResponse } from '@/base/api';
import {
  useMutationDelete,
  useMutationPost,
  useMutationPut,
  useQueryGet,
  type MutationCallbacks,
} from '@/base/hooks';
import type {
  InviteMemberPayload,
  TripMemberStatus,
  TripMember,
  UpdateRolePayload,
} from '../types/member.types';

export interface UseTripMembersParams {
  tripId?: number | string | null;
  enabled?: boolean;
  status?: TripMemberStatus;
}

export function useTripMembers({
  tripId,
  enabled = true, status,
}: UseTripMembersParams) {
  const isEnabled = enabled && Boolean(tripId);

  const query = useQueryGet<ApiResponse<TripMember[]>>({
    queryKey: ['trip-members', tripId, status ?? 'ALL'],
    endPoint: `/trip/${tripId}/members`,
    enabled: isEnabled, config: { params: { status } },
  });

  const rawMembers = query.data?.data;
  const members = useMemo(() => rawMembers ?? [], [rawMembers]);

  return {
    ...query,
    members,
  };
}

export function useActiveTripMembers(params: UseTripMembersParams) {
  const query = useTripMembers({ ...params, status: 'ACTIVE' });
  return { ...query, activeMembers: query.members };
}

export interface UseInviteMemberParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<TripMember>, InviteMemberPayload>;
}

export function useInviteMember({ tripId, options }: UseInviteMemberParams) {
  const mutation = useMutationPost<
    ApiResponse<TripMember>,
    InviteMemberPayload
  >({
    mutationKey: ['trip-members', 'invite', tripId],
    endPoint: `/trip/${tripId}/members`,
    options,
  });

  return {
    ...mutation,
    inviteMember: mutation.mutate,
    inviteMemberAsync: mutation.mutateAsync,
  };
}

export interface UseUpdateMemberRoleParams {
  tripId: number | string;
  memberId: number | string;
  options?: MutationCallbacks<ApiResponse<TripMember>, UpdateRolePayload>;
}

export function useUpdateMemberRole({
  tripId,
  memberId,
  options,
}: UseUpdateMemberRoleParams) {
  const mutation = useMutationPut<ApiResponse<TripMember>, UpdateRolePayload>({
    mutationKey: ['trip-members', 'update-role', tripId, memberId],
    endPoint: `/trip/${tripId}/members/${memberId}`,
    options,
  });

  return {
    ...mutation,
    updateRole: mutation.mutate,
    updateRoleAsync: mutation.mutateAsync,
  };
}

export interface UseRemoveMemberParams {
  tripId: number | string;
  memberId: number | string;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export function useRemoveMember({
  tripId,
  memberId,
  options,
}: UseRemoveMemberParams) {
  const mutation = useMutationDelete<ApiResponse<null>, Record<string, never>>({
    mutationKey: ['trip-members', 'remove', tripId, memberId],
    endPoint: `/trip/${tripId}/members/${memberId}`,
    options,
  });

  return {
    ...mutation,
    removeMember: mutation.mutate,
    removeMemberAsync: mutation.mutateAsync,
  };
}

export interface UseLeaveTripParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export function useLeaveTrip({ tripId, options }: UseLeaveTripParams) {
  const mutation = useMutationPost<ApiResponse<null>, Record<string, never>>({
    mutationKey: ['trip-members', 'leave', tripId],
    endPoint: `/trip/${tripId}/members/leave`,
    options,
  });

  return {
    ...mutation,
    leaveTrip: mutation.mutate,
    leaveTripAsync: mutation.mutateAsync,
  };
}

export interface AcceptMemberPayload { memberId: number | string }

export interface UseAcceptMemberParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<TripMember>, AcceptMemberPayload>;
}

export function useAcceptMember({ tripId, options }: UseAcceptMemberParams) {
  const mutation = useMutationPut<ApiResponse<TripMember>, AcceptMemberPayload>({
    mutationKey: ['trip-members', 'accept', tripId], endPoint: `/trip/${tripId}/members`,
    getEndPoint: (endPoint, payload) => `${endPoint}/${payload.memberId}/accept`, getPayload: () => ({}), options,
  });
  return { ...mutation, acceptMember: mutation.mutate, acceptMemberAsync: mutation.mutateAsync };
}
