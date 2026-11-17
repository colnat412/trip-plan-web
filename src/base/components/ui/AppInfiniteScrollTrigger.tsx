'use client';

import AppLoadingIndicator from './AppLoadingIndicator';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

export interface AppInfiniteScrollTriggerProps {
  hasMore: boolean;
  loading?: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  root?: Element | null;
  enabled?: boolean;
}

const AppInfiniteScrollTrigger = ({
  hasMore,
  loading = false,
  onLoadMore,
  rootMargin = '160px',
  root = null,
  enabled = true,
}: AppInfiniteScrollTriggerProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      { root, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, rootMargin, root, enabled]);

  if (!hasMore && !loading) return null;

  return (
    <Box
      ref={sentinelRef}
      sx={{
        flexShrink: 0,
        minHeight: '1px',
        display: 'flex',
        justifyContent: 'center',
        py: loading ? 1.5 : 0,
      }}
    >
      {loading && <AppLoadingIndicator />}
    </Box>
  );
};

export default AppInfiniteScrollTrigger;
