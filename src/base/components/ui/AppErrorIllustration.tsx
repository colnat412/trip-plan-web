'use client';

import AppMascot, { type MascotMood } from './AppMascot';

const AppErrorIllustration = ({ compact = false, mood = 'error' }: { compact?: boolean; mood?: MascotMood }) => (
  <AppMascot size={compact ? 88 : 144} mood={mood} />
);
export default AppErrorIllustration;
