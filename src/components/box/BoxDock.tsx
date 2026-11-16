import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../state/cart';
import { asset, faNumber, toman } from '../../lib/format';
import { PastryBox } from './PastryBox';
import s from './BoxDock.module.css';

// Where the last click happened — the flying pastry starts there.
let lastPointer: { x: number; y: number } | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', (e) => (lastPointer = { x: e.clientX, y: e.clientY }), { capture: true });
}

const HIDDEN_ON = /^\/(checkout|order)/;

/**
 * A little pastry box parked in the corner. Whenever something lands in the
 * cart (from any "add" button), the pastry flies into it on an arc, the box
 * flaps open and bounces. Tapping it opens the big box view.
 */
export function BoxDock() {
  const { lines, count, subtotal } = useCart();
  const { pathname } = useLocation();
  const dockRef = useRef<HTMLButtonElement>(null);
  const prev = useRef(new Map(lines.map((l) => [l.product.slug, l.qty])));
  const [bump, setBump] = useState(0);
  const [fresh, setFresh] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Detect which pastry was added by diffing quantities.
  useEffect(() => {
    const before = prev.current;
    const added = lines.find((l) => l.qty > (before.get(l.product.slug) ?? 0));
    prev.current = new Map(lines.map((l) => [l.product.slug, l.qty]));
    if (!added) return;

    setFresh(added.product.slug);
    const src = asset(added.product.images.cart ?? added.product.images.thumb ?? added.product.images.portrait);
    const dock = dockRef.current?.getBoundingClientRect();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!dock || reduce) {
      setBump((n) => n + 1);
      return;
    }
    flyToBox(src, lastPointer ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }, dock, () =>
      setBump((n) => n + 1),
    );
    lastPointer = null;
  }, [lines]);

  // Close the sheet on navigation / Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (HIDDEN_ON.test(pathname)) return null;

  return (
    <>
      <button
        ref={dockRef}
        className={`${s.dock} ${count ? '' : s.dockEmpty}`}
        onClick={() => setOpen(true)}
        aria-label={`جعبهٔ شیرینی — ${faNumber(count)} عدد`}
      >
        <span key={bump} className={`${s.mini} ${bump ? s.bump : ''}`}>
          <span className={s.flapL} />
          <span className={s.flapR} />
          <span className={s.miniBody}>
            <span className={s.miniTrim} />
          </span>
          {bump > 0 && (
            <span className={s.pop} aria-hidden>
              +۱ ♥
            </span>
          )}
        </span>
        {count > 0 && <span className={s.count}>{faNumber(count)}</span>}
        <span className={s.label}>جعبهٔ من</span>
      </button>

      {open && (
        <div className={s.overlay} onClick={() => setOpen(false)}>
          <section
            className={s.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="box-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className={s.close} onClick={() => setOpen(false)} aria-label="بستن">
              ×
            </button>
            <header className={s.head}>
              <h2 id="box-title" className={s.title}>
                جعبهٔ شیرینی‌ت 🎀
              </h2>
              <p className={s.sub}>
                {count ? `${faNumber(count)} شیرینی، هرکدوم توی سلفون و روبان خودش` : 'هنوز چیزی توش نیست'}
              </p>
            </header>

            <PastryBox lines={lines} fresh={fresh} />

            <footer className={s.foot}>
              {count > 0 && (
                <p className={s.total}>
                  جمع جعبه: <strong>{toman(subtotal)}</strong>
                </p>
              )}
              <div className={s.buttons}>
                <button className={s.ghost} onClick={() => setOpen(false)}>
                  یه چیز دیگه هم بذارم
                </button>
                {count > 0 && (
                  <Link to="/cart" className={s.go}>
                    ببندیمش، بریم سبد خرید
                  </Link>
                )}
              </div>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}

/** Fly a pastry image from a point to the box along a little arc. */
function flyToBox(src: string, from: { x: number; y: number }, to: DOMRect, done: () => void) {
  const size = 84;
  const el = document.createElement('img');
  el.src = src;
  el.alt = '';
  Object.assign(el.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'contain',
    zIndex: '80',
    pointerEvents: 'none',
    filter: 'drop-shadow(0 10px 10px rgba(59,31,26,.35))',
  });
  document.body.appendChild(el);

  const tx = to.left + to.width / 2 - size / 2;
  const ty = to.top + to.height / 2 - size / 2 - 10;
  const sx = from.x - size / 2;
  const sy = from.y - size / 2;
  const peak = Math.min(sy, ty) - 140; // arc height
  const frames: Keyframe[] = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const x = sx + (tx - sx) * t;
    const y = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * peak + t * t * ty; // quadratic Bézier
    const scale = 1 - 0.55 * t + 0.25 * Math.sin(Math.PI * t);
    frames.push({ transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${-30 * t}deg)`, opacity: t > 0.92 ? 0 : 1 });
  }
  el.animate(frames, { duration: 850, easing: 'cubic-bezier(.45,.05,.55,.95)' }).finished.finally(() => {
    el.remove();
    done();
  });
}
