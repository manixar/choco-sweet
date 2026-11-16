import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getProduct, products, type Product } from '../data/products';
import { useCart } from '../state/cart';
import { asset } from '../lib/format';
import {
  askNotificationPermission,
  isIOS,
  isStandalone,
  notificationsAllowed,
  notificationsSupported,
  showOvenNotification,
  store,
  type InstallPromptEvent,
} from './pwa';
import s from './PwaUi.module.css';

const OVEN_DELAY = 6_000; // first "fresh from the oven" toast
const INSTALL_DELAY = 9_000; // install sheet, after the toast is gone
const INSTALL_SNOOZE_DAYS = 7;

// Pages where popups would get in the way of paying.
const QUIET = /^\/(checkout|order)/;

/** Pain au chocolat first, then a different pastry on every later visit. */
function nextFreshPastry(): Product {
  const first = getProduct('pain-au-chocolat') ?? products[0];
  const seen = Number(store.get('oven-count') ?? '0');
  store.set('oven-count', String(seen + 1));
  if (seen === 0) return first;
  return products[seen % products.length];
}

const ovenCopy = (p: Product) => ({
  title: 'سلااااام! 👋',
  body: `${p.name} همین الان از فر دراومد؛ داغِ داغ! میخوایش؟`,
});

export function PwaUi() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { add } = useCart();

  /* ---------- "Fresh from the oven" toast ---------- */
  const [pastry, setPastry] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);
  const [bell, setBell] = useState<'idle' | 'on' | 'blocked'>(notificationsAllowed() ? 'on' : 'idle');
  const [ovenDone, setOvenDone] = useState(false);

  useEffect(() => {
    if (store.get('oven-shown', true)) {
      setOvenDone(true);
      return;
    }
    const t = window.setTimeout(() => {
      if (QUIET.test(window.location.pathname)) return setOvenDone(true);
      store.set('oven-shown', '1', true);
      const p = nextFreshPastry();
      // App in the background with notifications on → real system notification.
      if (document.hidden && notificationsAllowed()) {
        showOvenNotification({ ...ovenCopy(p), url: `/product/${p.slug}`, slug: p.slug, image: asset(p.images.portrait) });
        setOvenDone(true);
      } else {
        setPastry(p);
      }
    }, OVEN_DELAY);
    return () => window.clearTimeout(t);
  }, []);

  const closeOven = useCallback(() => {
    setPastry(null);
    setAdded(false);
    setOvenDone(true);
  }, []);

  const addPastry = () => {
    if (!pastry) return;
    add(pastry.slug);
    setAdded(true);
    window.setTimeout(closeOven, 1800);
  };

  const turnOnBell = async () => {
    const ok = await askNotificationPermission();
    setBell(ok ? 'on' : 'blocked');
    if (ok)
      showOvenNotification({
        title: 'حله! 🎉🔔',
        body: 'از این به بعد هر وقت یه سینی شیرینی داغ از فر دراومد، همین‌جا خبرت می‌کنیم.',
        tag: 'welcome',
      });
  };

  /* ---------- Notification "add to box" action → /product/:slug?add=1 ---------- */
  const [flash, setFlash] = useState<string | null>(null);
  useEffect(() => {
    const m = pathname.match(/^\/product\/([^/]+)$/);
    if (!m || !new URLSearchParams(search).has('add')) return;
    const p = getProduct(m[1]);
    if (p) {
      add(p.slug);
      setFlash(`${p.name} رفت تو جعبه! 🧺`);
      window.setTimeout(() => setFlash(null), 2600);
    }
    navigate(pathname, { replace: true });
  }, [pathname, search, add, navigate]);

  /* ---------- Install sheet ---------- */
  const deferred = useRef<InstallPromptEvent | null>(null);
  const [canPrompt, setCanPrompt] = useState(false);
  const [sheet, setSheet] = useState(false);
  const ios = isIOS();

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // we show our own, cuter prompt
      deferred.current = e as InstallPromptEvent;
      setCanPrompt(true);
    };
    const onInstalled = () => {
      setSheet(false);
      store.set('install-snooze', String(Date.now() + 3650 * 864e5));
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!ovenDone || isStandalone() || !(canPrompt || ios)) return;
    if (Number(store.get('install-snooze') ?? 0) > Date.now()) return;
    const t = window.setTimeout(() => {
      if (!QUIET.test(window.location.pathname)) setSheet(true);
    }, INSTALL_DELAY);
    return () => window.clearTimeout(t);
  }, [ovenDone, canPrompt, ios]);

  const snooze = () => {
    store.set('install-snooze', String(Date.now() + INSTALL_SNOOZE_DAYS * 864e5));
    setSheet(false);
  };

  const install = async () => {
    const e = deferred.current;
    if (!e) return;
    await e.prompt();
    const { outcome } = await e.userChoice;
    deferred.current = null;
    setCanPrompt(false);
    if (outcome === 'accepted') setSheet(false);
    else snooze();
  };

  // On iPhone, notifications only work once the site is added to the home screen.
  const bellPossible = notificationsSupported() && !(ios && !isStandalone());

  return (
    <>
      {pastry && (
        <aside className={s.oven} role="status" aria-live="polite">
          <div className={s.ovenAwning} aria-hidden />
          <button className={s.close} onClick={closeOven} aria-label="بستن">
            ×
          </button>

          <div className={s.ovenBody}>
            <div className={s.tray} aria-hidden>
              <span className={s.steam}>
                <i />
                <i />
                <i />
              </span>
              <img src={asset(pastry.images.thumb ?? pastry.images.portrait)} alt="" />
            </div>

            <div className={s.ovenText}>
              {added ? (
                <>
                  <p className={s.ovenTitle}>رفت تو جعبه! 🎉</p>
                  <p className={s.ovenCopy}>نوش جان؛ هر وقت خواستی از سبد خرید تکمیلش کن.</p>
                </>
              ) : (
                <>
                  <p className={s.ovenTitle}>{ovenCopy(pastry).title}</p>
                  <p className={s.ovenCopy}>{ovenCopy(pastry).body}</p>
                  <div className={s.actions}>
                    <button className={s.yes} onClick={addPastry}>
                      آره، بذار تو جعبه! 🧺
                    </button>
                    <Link to={`/product/${pastry.slug}`} className={s.peek} onClick={closeOven}>
                      ببینمش
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {!added && bellPossible && bell !== 'on' && (
            <button className={s.bell} onClick={turnOnBell} disabled={bell === 'blocked'}>
              <span className={s.bellIcon} aria-hidden>
                🔔
              </span>
              {bell === 'blocked'
                ? 'اعلان‌ها توی تنظیمات مرورگر بسته‌ست'
                : 'دفعهٔ بعد رو گوشیم خبرم کن'}
            </button>
          )}
          {!added && ios && !isStandalone() && (
            <p className={s.hint}>برای اعلان روی آیفون، اول چوکوبار رو به صفحهٔ اصلی اضافه کن 📲</p>
          )}
        </aside>
      )}

      {flash && (
        <p className={s.flash} role="status">
          {flash}
        </p>
      )}

      {sheet && (
        <div className={s.sheetWrap} role="dialog" aria-modal="false" aria-labelledby="install-title">
          <section className={s.sheet}>
            <span className={s.grip} aria-hidden />
            <button className={s.close} onClick={snooze} aria-label="بستن">
              ×
            </button>

            <div className={s.sheetHead}>
              <img src="/pwa/icon-192.png" alt="" className={s.appIcon} />
              <div>
                <h2 id="install-title" className={s.sheetTitle}>
                  چوکوبار رو بذار رو گوشیت! 📲
                </h2>
                <p className={s.sheetCopy}>بدون استور، مثل یه اپ واقعی: آیکون روی صفحه، باز شدن سریع و خبرِ داغ‌ترین شیرینی‌ها.</p>
              </div>
            </div>

            {ios && !canPrompt ? (
              <ol className={s.steps}>
                <li>
                  <span className={s.stepNo}>۱</span>
                  <span>
                    پایین صفحه دکمهٔ اشتراک‌گذاری <ShareIcon /> رو بزن
                  </span>
                </li>
                <li>
                  <span className={s.stepNo}>۲</span>
                  <span>گزینهٔ «Add to Home Screen» یا «افزودن به صفحهٔ اصلی» رو انتخاب کن</span>
                </li>
                <li>
                  <span className={s.stepNo}>۳</span>
                  <span>بالا سمت راست «Add» رو بزن؛ تموم! 🎉</span>
                </li>
              </ol>
            ) : (
              <div className={s.sheetActions}>
                <button className={s.yes} onClick={install}>
                  نصبش کن
                </button>
                <button className={s.peek} onClick={snooze}>
                  بعداً
                </button>
              </div>
            )}
          </section>
          {ios && !canPrompt && (
            <span className={s.pointer} aria-hidden>
              ⬇
            </span>
          )}
        </div>
      )}
    </>
  );
}

function ShareIcon() {
  return (
    <svg className={s.share} viewBox="0 0 24 24" width="20" height="20" aria-label="اشتراک‌گذاری">
      <path d="M12 3v12M8 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
