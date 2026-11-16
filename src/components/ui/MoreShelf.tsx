import { Link } from 'react-router-dom';
import { products, type Product } from '../../data/products';
import { asset, faNumber, toman } from '../../lib/format';
import s from './MoreShelf.module.css';

type Props = {
  /** Pastries already on the page (left out of the conveyor when possible). */
  shown: Product[];
  /** Pastries the visitor hasn't seen yet in the current filter. */
  rest: Product[];
  /** Current category filter, forwarded to the full collection page. */
  filter: string;
};

/**
 * A little bakery "conveyor belt" of the pastries that didn't fit on the
 * home page, with a playful call to open the full collection.
 */
export function MoreShelf({ shown, rest, filter }: Props) {
  const shownSlugs = new Set(shown.map((p) => p.slug));
  // Prefer the unseen pastries of this filter; fall back to everything else.
  const belt = rest.length ? rest : products.filter((p) => !shownSlugs.has(p.slug));
  const total = rest.length || products.length;

  // Repeat so the conveyor is always wider than the screen, then double it
  // for a seamless loop (the track slides exactly half its width).
  const loop: Product[] = [];
  while (belt.length && loop.length < 14) loop.push(...belt);
  const track = [...loop, ...loop];

  const to = filter === 'all' ? '/collection' : `/collection?cat=${filter}`;

  return (
    <section className={s.shelf} aria-labelledby="more-shelf-title">
      <div className={s.belt} aria-hidden>
        <div className={s.track} style={{ ['--items' as string]: loop.length }}>
          {track.map((p, i) => (
            <Link
              key={`${p.slug}-${i}`}
              to={`/product/${p.slug}`}
              className={s.plate}
              style={{ ['--i' as string]: i % 5 }}
              tabIndex={-1}
            >
              <img src={asset(p.images.thumb ?? p.images.portrait)} alt="" loading="lazy" />
              <span className={s.tag}>{toman(p.price)}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className={s.copy}>
        <p className={s.kicker}>
          <span className={s.steam} aria-hidden>
            <i />
            <i />
            <i />
          </span>
          تازه از فر رسیده
        </p>
        <h2 id="more-shelf-title" className={s.title}>
          ویترین هنوز تموم نشده!
        </h2>
        <p className={s.lede}>
          {rest.length
            ? `${faNumber(total)} شیرینی دیگه پشت شیشه منتظرتن؛ یه سر بزن، شاید عاشق یکیشون شدی.`
            : `کل ویترین ${faNumber(total)} شیرینی داره؛ بیا بقیه‌شون رو هم ببین.`}
        </p>
        <Link to={to} className={s.cta}>
          دیدن همهٔ شیرینی‌ها
          <span className={s.ctaArrow} aria-hidden>
            ←
          </span>
        </Link>
      </div>
    </section>
  );
}
