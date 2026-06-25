import { useEffect, useState } from 'react';

export const useElapsedTimer = (isRunning: boolean) => {
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    setStartedAt(Date.now());
    setElapsedSeconds(0);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - startedAt) / 1000)),
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, startedAt]);

  return elapsedSeconds;
};
