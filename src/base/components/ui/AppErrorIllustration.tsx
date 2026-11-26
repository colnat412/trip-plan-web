'use client';

import AppMascot, { type MascotMood } from './AppMascot';

interface AppErrorIllustrationProps { compact?: boolean; mood?: MascotMood }

const AppErrorIllustration = ({ compact = false, mood = 'error' }: AppErrorIllustrationProps) => (
  <AppMascot size={compact ? 88 : 144} mood={mood} />
);
export default AppErrorIllustration;
