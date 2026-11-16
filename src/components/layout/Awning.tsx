import { Link } from 'react-router-dom';
import { asset } from '../../lib/format';
import s from './Awning.module.css';

/**
 * Striped bakery awning across the top of every page, with the shop's logo
 * on a round sign in the middle. Purely decorative apart from the home link.
 */
export function Awning({ logo = 'logo/logo-mark.png' }: { logo?: string }) {
  return (
    <div className={s.awning}>
      <div className={s.rail} aria-hidden />
      <div className={s.canopy} aria-hidden />
      <div className={s.valance} aria-hidden />

      <Link to="/" className={s.sign} aria-label="چوکو بار — صفحهٔ اصلی">
        <span className={s.hook} aria-hidden />
        <span className={s.badge}>
          <img src={asset(logo)} alt="" draggable={false} />
        </span>
      </Link>
    </div>
  );
}
