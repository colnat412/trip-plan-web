'use client';

import Image from 'next/image';
import styles from './AppMascot.module.css';

export type MascotMood = 'welcome' | 'success' | 'warning' | 'error' | 'not_found' | 'empty_data' | 'loading' | 'forbidden' | 'processing' | 'maintenance' | 'celebration' | 'offline' | 'thinking' | 'sad' | 'finish' | 'walk_01' | 'walk_02' | 'run' | 'sleep' | 'surprised';

/** Decorative artwork; adjacent copy and accessible controls carry the meaning. */
interface AppMascotProps { size?: number; mood?: MascotMood; decorative?: boolean }

const AppMascot = ({ size = 112, mood = 'welcome', decorative = true }: AppMascotProps) => (
  <Image src={`/mascot/chibi-brand/${mood}.png`} alt={decorative ? '' : 'Vi Vu'} width={size} height={size}
    className={styles.mascot} data-mood={mood}
    style={{ width: size, height: size, maxWidth: '100%', objectFit: 'contain', flexShrink: 0 }} />
);
export default AppMascot;
