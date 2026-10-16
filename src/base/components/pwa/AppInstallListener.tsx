'use client';

import { useEffect } from 'react';
import { listenForInstall } from '@/base/pwa/install-store';

const AppInstallListener = () => {
  useEffect(() => listenForInstall(), []);
  return null;
};

export default AppInstallListener;
