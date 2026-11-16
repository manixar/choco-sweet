import type { CartLine } from '../../state/cart';
import { asset, faNumber } from '../../lib/format';
import s from './PastryBox.module.css';

const img = (l: CartLine) => asset(l.product.images.cart ?? l.product.images.thumb ?? l.product.images.portrait);

/**
 * An open bakery box (lid up, like a cake-box mockup) with every pastry in the
 * cart wrapped in a cellophane bag tied with a yellow ribbon.
 * `fresh` marks the slug that was just added so it drops in with a bounce.
 */
export function PastryBox({ lines, fresh }: { lines: CartLine[]; fresh?: string | null }) {
  return (
    <div className={s.box}>
      <div className={s.lid} aria-hidden>
        <span className={s.lidPrint}>چوکوبار • تازه از فر</span>
      </div>

      <div className={s.inside}>
        {lines.length === 0 ? (
          <p className={s.empty}>
            جعبه‌ت هنوز خالیه! 🥺
            <br />
            یه شیرینی بنداز توش.
          </p>
        ) : (
          <ul className={s.packets}>
            {lines.map((l, i) => (
              <li
                key={l.product.slug}
                className={`${s.packet} ${fresh === l.product.slug ? s.fresh : ''}`}
                style={{ ['--tilt' as string]: `${((i * 37) % 9) - 4}deg` }}
              >
                {l.qty > 1 && <span className={`${s.bag} ${s.behind}`} aria-hidden />}
                <span className={s.neck} aria-hidden />
                <span className={s.bag}>
                  <img src={img(l)} alt={l.product.name} />
                  <span className={s.shine} aria-hidden />
                </span>
                <span className={s.bow} aria-hidden>
                  <i className={s.loopL} />
                  <i className={s.loopR} />
                  <i className={s.tailL} />
                  <i className={s.tailR} />
                  <i className={s.knot} />
                </span>
                {l.qty > 1 && <span className={s.qty}>×{faNumber(l.qty)}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={s.front} aria-hidden>
        <span className={s.trim} />
        <span className={s.seal}>
          <img src={asset('logo/logo-mark.png')} alt="" />
        </span>
        <span className={s.thanks}>
          مرسی
          <br />
          که هستی ♥
        </span>
      </div>
    </div>
  );
}
