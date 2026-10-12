'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { ApiError } from '@/base/api';
import type { UserProfile } from '@/features/auth/types';
import useCurrentUser from '../hooks/useCurrentUser';

interface UserContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isFetching: boolean;
  error: ApiError | null;
  updateUser: (user: UserProfile) => void;
  refetchUser: () => Promise<unknown>;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, isFetching, error, refetch, replaceData } =
    useCurrentUser();

  const updateUser = useCallback(
    (profile: UserProfile) => {
      replaceData({ status: 200, message: 'Success', data: profile });
    },
    [replaceData],
  );

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      isLoading,
      isFetching,
      error,
      refetchUser: refetch,
      updateUser,
    }),
    [user, isLoading, isFetching, error, refetch, updateUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

export default UserProvider;
