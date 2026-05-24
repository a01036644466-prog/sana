let _notifTimer = null;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('message', e => {
  if (!e.data) return;
  if (e.data.type === 'schedule') {
    clearTimeout(_notifTimer);
    const ms = e.data.ms;
    if (ms > 0 && ms < 172800000) {
      _notifTimer = setTimeout(() => {
        self.registration.showNotification('SANA', {
          body: e.data.body || 'Как ты сегодня? Не забудь про чекин 🌟',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'sana-daily',
          requireInteraction: false,
          vibrate: [200, 100, 200]
        });
      }, ms);
    }
  }
  if (e.data.type === 'cancel') {
    clearTimeout(_notifTimer);
  }
});

self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(d.title || 'SANA', {
    body: d.body || 'Как ты сегодня?',
    icon: '/icon-192.png',
    tag: 'sana-daily'
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const c of clients) {
        if ('focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});
