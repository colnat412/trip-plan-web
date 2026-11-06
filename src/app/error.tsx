'use client';

import { useRouter } from 'next/navigation';
import { AppErrorState, AppPageContainer } from '@/base/components/ui';

const ErrorPage = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const router = useRouter();
  return (
    <AppPageContainer>
      <AppErrorState
        variant="unexpected"
        onRetry={() => {
          router.refresh();
          reset();
        }}
      />
    </AppPageContainer>
  );
};

export default ErrorPage;
