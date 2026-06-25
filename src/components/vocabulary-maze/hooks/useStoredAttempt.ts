import { useCallback, useEffect, useState } from 'react';

import { ATTEMPT_STORAGE_PREFIX } from '../domain/constants';
import type { FinishedAttempt } from '../domain/types';

const getStorageKey = (date: string) => `${ATTEMPT_STORAGE_PREFIX}:${date}`;

const parseAttempt = (value: string | null) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as FinishedAttempt;
  } catch {
    return null;
  }
};

export const useStoredAttempt = (date: string) => {
  const [attempt, setAttempt] = useState<FinishedAttempt | null>(null);

  useEffect(() => {
    setAttempt(parseAttempt(window.localStorage.getItem(getStorageKey(date))));
  }, [date]);

  const saveAttempt = useCallback(
    (nextAttempt: FinishedAttempt) => {
      window.localStorage.setItem(
        getStorageKey(date),
        JSON.stringify(nextAttempt),
      );
      setAttempt(nextAttempt);
    },
    [date],
  );

  return { attempt, saveAttempt };
};
