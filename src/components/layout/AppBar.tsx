import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../state/cart';
import { faNumber } from '../../lib/format';
import s from './AppBar.module.css';

/** Ask the floating pastry box (BoxDock) to open its big view. */
export const openBox = () => window.dispatchEvent(new Event('chocobar:open-box'));

/**
 * Bottom navigation for the installed app (home-screen PWA).
 * An installed app has no browser toolbar — on iPhone there is no back
 * button at all — so this bar provides Back, Home, Showcase, Box, Orders.
 * It is only visible when <html> has the `standalone` class (see main.tsx).
 */
export function AppBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { count } = useCart();
  const canGoBack = location.key !== 'default' || location.pathname !== '/';

  const back = () => {
    if (location.key !== 'default') navigate(-1);
    else navigate('/', { replace: true });
  };

  return (
    <nav className={s.bar} aria-label="منوی برنامه">
      <button className={s.item} onClick={back} disabled={!canGoBack} aria-label="برگشت">
        <svg viewBox="0 0 24 24" aria-hidden>
          {/* RTL: "back" points to the right */}
          <path d="M9 5l7 7-7 7" />
        </svg>
        <span>برگشت</span>
      </button>

      <NavLink to="/" end className={({ isActive }) => `${s.item} ${isActive ? s.active : ''}`}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
        </svg>
        <span>خانه</span>
      </NavLink>

      <NavLink to="/collection" className={({ isActive }) => `${s.item} ${isActive ? s.active : ''}`}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <rect x="4" y="4" width="7" height="7" rx="2" />
          <rect x="13" y="4" width="7" height="7" rx="2" />
          <rect x="4" y="13" width="7" height="7" rx="2" />
          <rect x="13" y="13" width="7" height="7" rx="2" />
        </svg>
        <span>ویترین</span>
      </NavLink>

      <button className={`${s.item} ${s.boxItem}`} onClick={openBox} aria-label={`جعبهٔ من، ${faNumber(count)} شیرینی`}>
        <span className={s.boxIcon} aria-hidden>
          <i />
        </span>
        {count > 0 && <b className={s.badge}>{faNumber(count)}</b>}
        <span>جعبه</span>
      </button>

      <NavLink to="/order/tracking" className={({ isActive }) => `${s.item} ${isActive ? s.active : ''}`}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17" cy="18" r="1.6" />
        </svg>
        <span>سفارش</span>
      </NavLink>
    </nav>
  );
}
