'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { axiosGet, normalizeApiError, type ApiError, type ApiResponse } from '@/base/api';
import type { NotificationItem, NotificationPage } from '../types';

const NOTIFICATION_PAGE_SIZE = 20;

const useNotificationInbox = (accountKey: string, unreadOnly: boolean, version: number) => {
  const dataKey = `${accountKey}:${unreadOnly}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [through, setThrough] = useState<string | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const request = useRef<{ controller: AbortController; version: number } | null>(null);
  const epoch = useRef(0);
  const load = useCallback(async (cursor: string | null = null) => {
    if (cursor && request.current) return;
    request.current?.controller.abort();
    const controller = new AbortController();
    const current = ++epoch.current;
    request.current = { controller, version: current };
    setLoading(true); setError(null);
    try {
      const response = await axiosGet<ApiResponse<NotificationPage>>('/notifications', {
        params: { ...(cursor ? { cursor } : {}), unreadOnly, limit: NOTIFICATION_PAGE_SIZE }, signal: controller.signal,
      });
      if (controller.signal.aborted || current !== epoch.current) return;
      setItems(previous => {
        const merged = cursor ? [...previous, ...response.data.items] : response.data.items;
        return [...new Map(merged.map(item => [item.id, item])).values()];
      });
      setLoadedKey(dataKey);
      setNextCursor(response.data.nextCursor);
      // Keep the read-all boundary from the first page, not a later load-more request.
      if (!cursor) setThrough(response.data.through);
    } catch (error) {
      if (!controller.signal.aborted && current === epoch.current) setError(normalizeApiError(error));
    } finally {
      if (!controller.signal.aborted && current === epoch.current) { setLoading(false); request.current = null; }
    }
  }, [unreadOnly, dataKey]);
  const cancel = useCallback(() => {
    epoch.current++;
    request.current?.controller.abort();
    request.current = null;
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => { clearTimeout(timer); cancel(); };
  }, [load, version, accountKey, cancel]);
  const updateItem = useCallback((updated: NotificationItem) => {
    setItems(previous => previous.flatMap(item => item.id !== updated.id ? [item]
      : unreadOnly && updated.readAt ? [] : [updated]));
  }, [unreadOnly]);
  const stale = loadedKey !== dataKey;
  return { items: stale ? [] : items, nextCursor: stale ? null : nextCursor,
    through: stale ? null : through, error, loading: loading || (stale && !error), reload: load, updateItem };
};
export default useNotificationInbox;
