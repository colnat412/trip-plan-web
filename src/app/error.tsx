'use client';

import { useRouter } from 'next/navigation';
import { AppErrorState, AppPageContainer } from '@/base/components/ui';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({
  reset,
}: ErrorPageProps) => {
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
