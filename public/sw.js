/* ─────────────────────────────────────────────
   Chocobar service worker
   • offline: app shell + images cached, pages fall back to the cached shell
   • notifications: shows "fresh from the oven" notifications, either sent by
     the page (postMessage) or by a push server (push event)
   Bump VERSION whenever this file changes so old caches are cleared.
   ───────────────────────────────────────────── */
const VERSION = 'chocobar-v1';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

const SHELL_URLS = ['/', '/manifest.webmanifest', '/pwa/icon-192.png', '/pwa/icon-512.png', '/pwa/badge-96.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Never touch Vite's dev server internals, so hot reload keeps working.
const isDevRequest = (url) =>
  url.pathname.startsWith('/@') || url.pathname.startsWith('/src/') || url.pathname.includes('node_modules') || url.search.includes('t=');

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isDevRequest(url)) return;

  // Pages: network first, fall back to the cached app shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/')),
    );
    return;
  }

  // Images, fonts and built JS/CSS: serve from cache, refresh in the background.
  if (/\.(png|jpe?g|webp|svg|woff2?|js|css)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
});

/* ---------- Notifications ---------- */

function ovenNotification(data = {}) {
  const title = data.title || 'سلااااام! 👋🥐';
  return self.registration.showNotification(title, {
    body: data.body || 'یه سینی شیرینی داغ همین الان از فر دراومد. میخوایش؟',
    icon: data.icon || '/pwa/icon-192.png',
    image: data.image,
    badge: '/pwa/badge-96.png',
    dir: 'rtl',
    lang: 'fa',
    tag: data.tag || 'oven',
    renotify: true,
    vibrate: [80, 40, 80, 40, 160],
    data: { url: data.url || '/', slug: data.slug },
    actions: [
      { action: 'add', title: 'آره، بذار تو جعبه! 🧺' },
      { action: 'later', title: 'بعداً' },
    ],
  });
}

// From a push server (Web Push). Payload: JSON {title, body, url, slug, image}
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data && event.data.text() };
  }
  event.waitUntil(ovenNotification(data));
});

// From the open page (works on Android, where pages can't call `new Notification`).
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'oven') event.waitUntil(ovenNotification(event.data.payload));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'later') return;
  const { url, slug } = event.notification.data || {};
  const target = new URL(event.action === 'add' && slug ? `/product/${slug}?add=1` : url || '/', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      const win = wins.find((w) => new URL(w.url).origin === self.location.origin);
      if (win) return win.navigate(target).then((w) => (w || win).focus());
      return self.clients.openWindow(target);
    }),
  );
});
