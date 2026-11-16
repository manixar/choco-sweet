/* PWA helpers: service worker registration, install prompt and notifications */

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('[pwa] service worker failed', err));
  });
}

/* ---------- Install ---------- */

// Chrome/Edge/Android fire this before showing their own install UI.
export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

export const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS

/* ---------- Small, crash-proof storage (private mode / embedded views can throw) ---------- */

export const store = {
  get(key: string, session = false) {
    try {
      return (session ? sessionStorage : localStorage).getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string, session = false) {
    try {
      (session ? sessionStorage : localStorage).setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

/* ---------- Notifications ---------- */

export const notificationsSupported = () => 'Notification' in window && 'serviceWorker' in navigator;

export const notificationsAllowed = () => notificationsSupported() && Notification.permission === 'granted';

/** Ask for permission. Must be called from a click (iOS requires it, and the app must be installed there). */
export async function askNotificationPermission(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  return (await Notification.requestPermission()) === 'granted';
}

export interface OvenPayload {
  title?: string;
  body?: string;
  url?: string;
  slug?: string;
  icon?: string;
  image?: string;
  tag?: string;
}

/** Show a system notification through the service worker (works on Android and installed iOS apps). */
export async function showOvenNotification(payload: OvenPayload) {
  if (!notificationsAllowed()) return false;
  const reg = await navigator.serviceWorker.ready;
  reg.active?.postMessage({ type: 'oven', payload });
  return true;
}

/* ---------- Push (for a future server) ----------
   To notify phones while the app is closed you need a small push server with
   VAPID keys. Put the public key in VITE_VAPID_PUBLIC_KEY and send the returned
   subscription to that server; the service worker already handles `push`. */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  const key = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;
  if (!key || !notificationsAllowed() || !('PushManager' in window)) return null;
  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (existing) return existing;
  const raw = atob(key.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (key.length % 4)) % 4));
  const appServerKey = Uint8Array.from(raw, (ch) => ch.charCodeAt(0));
  return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appServerKey });
}
