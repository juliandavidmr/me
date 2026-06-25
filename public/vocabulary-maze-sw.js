/* global globalThis */

const DAY_MS = 24 * 60 * 60 * 1000;
let reminderTimer = null;

const scheduleReminder = (title, body) => {
  if (reminderTimer !== null) {
    clearTimeout(reminderTimer);
  }

  reminderTimer = setTimeout(() => {
    globalThis.registration.showNotification(title, {
      body,
      icon: '/icon-light.svg',
      badge: '/icon-light.svg',
      tag: 'vocabulary-maze-daily-reminder',
    });
    scheduleReminder(title, body);
  }, DAY_MS);
};

globalThis.addEventListener('install', () => {
  globalThis.skipWaiting();
});

globalThis.addEventListener('activate', (event) => {
  event.waitUntil(globalThis.clients.claim());
});

globalThis.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'schedule-daily-reminder') {
    scheduleReminder(event.data.title, event.data.body);
  }
});
