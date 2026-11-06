'use client';

import { AppErrorState, AppPageContainer } from '@/base/components/ui';

const NotFoundPage = () => (
  <AppPageContainer>
    <AppErrorState variant="notFound" />
  </AppPageContainer>
);

export default NotFoundPage;
