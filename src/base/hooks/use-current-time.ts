'use client';

import { useEffect, useState } from 'react';

/** Client clock, refreshed at minute boundaries and when the app regains focus. */
const useCurrentTime = () => {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      setNow(new Date());
      clearTimeout(timer);
      timer = setTimeout(update, 60_000 - (Date.now() % 60_000));
    };
    const onVisibility = () => {
      if (!document.hidden) update();
    };
    timer = setTimeout(update, 0);
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  return now;
};

export default useCurrentTime;
