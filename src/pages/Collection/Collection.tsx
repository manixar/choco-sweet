import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { Icon } from '../../components/ui/Icon';
import { products, type Category, type Product } from '../../data/products';
import { useCart } from '../../state/cart';
import { asset, faIndex, faNumber, toman } from '../../lib/format';
import { MoreShelf } from '../../components/ui/MoreShelf';
import s from './Collection.module.css';

export type Filter = 'all' | Category;

/** How many pastries the home page shows before the "see all" shelf. */
const HOME_LIMIT = 6;

/** Pastries floating in the hero showcase (main, back-left, front). */
const HERO_PASTRIES = ['butter-croissant', 'pistachio-new-york-roll', 'pain-au-chocolat'];

export const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: `همه شیرینی‌ها • ${faNumber(products.length)}` },
  { id: 'classic', label: 'کلاسیک' },
  { id: 'chocolate', label: 'شکلاتی' },
  { id: 'fruit', label: 'میوه‌ای' },
];

export default function Collection() {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = filter === 'all' ? products : products.filter((p) => p.category === filter);

  return (
    <PageShell>
      <section className={s.top}>
        <div className={s.intro}>
          <p className={s.edition}>
            <span className={s.dot} aria-hidden />
            کالکشن وینوازری ۲۰۲۶ • پخت محدود روزانه
          </p>
          <h1 className={s.heading}>
            {faNumber(products.length)} روایت
            <br />
            از یک <em className={s.accentWord}>وسوسه</em>
          </h1>
          <p className={s.lede}>
            اینجا هر شیرینی داستان زندگی خودشو داره؛ از لایه اول تا آخرین خرده. جعبه دلخواهت را بساز.
          </p>

          <ul className={s.perks} aria-label="ویژگی‌ها">
            <li>
              <span aria-hidden>🤲</span>دست‌ساز
            </li>
            <li>
              <span aria-hidden>⏳</span>آرام‌تخمیر
            </li>
            <li>
              <span aria-hidden>🔥</span>تازه از فر
            </li>
          </ul>

          <div className={s.ctaRow}>
            <a href="#pastries" className={s.cta}>
              جعبه‌ات رو بچین
              <span className={s.ctaArrow} aria-hidden>
                ↓
              </span>
            </a>
            <p className={s.note}>
              <Icon src="icons/truck-16-accent.svg" size={16} />
              ارسال با جعبه محافظ در بازه انتخابی شما
            </p>
          </div>
        </div>

        <div className={s.showcase} aria-hidden>
          <span className={s.plate} />
          {HERO_PASTRIES.map((slug, i) => {
            const p = products.find((x) => x.slug === slug);
            return p ? <img key={slug} src={asset(p.images.floating ?? p.images.portrait)} alt="" className={s[`hero${i}`]} /> : null;
          })}
          <span className={s.sticker}>
            <strong>{faNumber(products.length)}</strong>
            طعم تازه
          </span>
        </div>
      </section>

      <div className={s.filters} id="pastries">
        <div className={s.categories} role="tablist" aria-label="دسته‌بندی">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`${s.filter} ${filter === f.id ? s.filterActive : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className={s.sort}>
          مرتب‌سازی: پیشنهاد چوکوبار
          <Icon src="icons/chevron-down.svg" size={16} />
        </button>
      </div>

      <div className={s.grid}>
        {visible.slice(0, HOME_LIMIT).map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <MoreShelf
        shown={visible.slice(0, HOME_LIMIT)}
        rest={visible.slice(HOME_LIMIT)}
        filter={filter}
      />
    </PageShell>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className={s.card}>
      <div className={s.stage}>
        <img src={asset('decor/stage-glow.svg')} alt="" className={s.glow} />
        <img src={asset(product.images.portrait)} alt={product.name} className={s.portrait} />
        <span className={s.number}>{faIndex(product.index)}</span>
        {product.badge && <span className={s.badge}>{product.badge}</span>}
      </div>
      <div className={s.info}>
        <h2 className={s.title}>
          {product.hasPage ? (
            <Link to={`/product/${product.slug}`} className={s.titleLink}>
              {product.name}
            </Link>
          ) : (
            product.name
          )}
        </h2>
        <div className={s.purchase}>
          <span className={s.price}>{toman(product.price)}</span>
          <button className={s.add} onClick={() => add(product.slug)}>
            افزودن به جعبه
            <Icon src="icons/plus-14-dark.svg" size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
