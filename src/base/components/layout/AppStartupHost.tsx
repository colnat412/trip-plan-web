'use client';

import { useSyncExternalStore } from 'react';
import AppStartupScreen from '../ui/AppStartupScreen';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const AppStartupHost = () => {
  const hydrated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return hydrated ? null : <AppStartupScreen />;
};

export default AppStartupHost;
