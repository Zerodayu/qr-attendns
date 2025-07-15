
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'QR Scan', {
      body: data.body || 'QR code scanned!',
      icon: '/next.svg',
      badge: '/next.svg',
    })
  );
});