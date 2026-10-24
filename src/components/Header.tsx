import { Link, NavLink } from 'react-router-dom';
import { Icon } from './Icon';
import { useCart } from '../state/cart';
import { faNumber } from '../lib/format';
import s from './Header.module.css';

export function Header() {
  const { count } = useCart();

  return (
    <header>
      <nav className={s.nav} aria-label="اصلی">
        {/* Right side (RTL start): brand lockup */}
        <Link to="/" className={s.brand} aria-label="چوکو بار — صفحهٔ اصلی">
          <Icon src="icons/artisan-emblem.svg" size={36} height={39} />
          <span className={s.wordmark}>
            <span className={s.wordmarkTop}>چوکو</span>
            <span className={s.wordmarkBottom}>بار</span>
          </span>
          <span className={s.dailyBake}>
            <Icon src="icons/freshness-dot.svg" size={5} />
            پخت روز • هنر سه‌بعدی
          </span>
        </Link>

        {/* Left side (RTL end): shopping controls */}
        <div className={s.controls}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${s.link} ${s.collectionLink} ${isActive ? s.linkActive : ''}`}
            style={{ color: 'var(--color-text)' }}
          >
            کالکشن شیرینی‌ها
          </NavLink>
          <span className={s.separator} aria-hidden />
          <NavLink to="/order/tracking" className={({ isActive }) => `${s.link} ${isActive ? s.linkActive : ''}`}>
            پیگیری سفارش
          </NavLink>
          <Link to="/cart" className={s.basket}>
            <Icon src="icons/shopping-bag.svg" size={17} />
            سبد خرید ({faNumber(count)})
          </Link>
        </div>
      </nav>
      <div className={s.baseline} aria-hidden />
    </header>
  );
}
