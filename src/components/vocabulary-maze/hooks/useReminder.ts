import { useCallback, useEffect, useState } from 'react';

import { REMINDER_STORAGE_KEY, SERVICE_WORKER_PATH } from '../domain/constants';

type ReminderState = 'idle' | 'unsupported' | 'denied' | 'enabled' | 'error';

export const useReminder = () => {
  const [state, setState] = useState<ReminderState>('idle');

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      setState('unsupported');
      return;
    }

    if (window.localStorage.getItem(REMINDER_STORAGE_KEY) === 'true') {
      setState('enabled');
    }
  }, []);

  const enableReminder = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      setState('unsupported');
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      setState('denied');
      return;
    }

    try {
      const registration =
        await navigator.serviceWorker.register(SERVICE_WORKER_PATH);
      const activeWorker =
        registration.active ??
        registration.waiting ??
        registration.installing ??
        navigator.serviceWorker.controller;

      activeWorker?.postMessage({
        type: 'schedule-daily-reminder',
        title: 'Vocabulary Maze',
        body: 'Your daily vocabulary maze is ready.',
      });

      window.localStorage.setItem(REMINDER_STORAGE_KEY, 'true');
      setState('enabled');
    } catch {
      setState('error');
    }
  }, []);

  return { enableReminder, state };
};
