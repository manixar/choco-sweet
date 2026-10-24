import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { products, type Category, type Product } from '../data/products';
import { useCart } from '../state/cart';
import { asset, faIndex, faNumber, toman } from '../lib/format';
import s from './Collection.module.css';

type Filter = 'all' | Category;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: `همهٔ شیرینی‌ها • ${faNumber(products.length)}` },
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
          <p className={s.edition}>کالکشن وینوازری ۲۰۲۶ • پخت محدود روزانه</p>
          <h1 className={s.heading}>شش روایت از یک وسوسه</h1>
          <p className={s.lede}>از لایهٔ اول تا آخرین خرده؛ جعبهٔ دلخواهت را بساز.</p>
        </div>
        <div className={s.note}>
          <p className={s.noteTitle}>دست‌ساز. آرام‌تخمیر. تازه.</p>
          <p className={s.noteCopy}>ارسال با جعبهٔ محافظ در بازهٔ انتخابی شما</p>
        </div>
      </section>

      <div className={s.filters}>
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
          مرتب‌سازی: پیشنهاد چوکو بار
          <Icon src="icons/chevron-down.svg" size={16} />
        </button>
      </div>

      <div className={s.grid}>
        {visible.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </PageShell>
  );
}

function ProductCard({ product }: { product: Product }) {
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
