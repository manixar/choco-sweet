import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { products, type Product } from '../../data/products';
import { faNumber } from '../../lib/format';
import { FILTERS, ProductCard, type Filter } from '../Collection/Collection';
import c from '../Collection/Collection.module.css';
import s from './AllProducts.module.css';

/** Pastries per "tray" — how many more appear each time "load more" is pressed. */
const PAGE = 12;

type Sort = 'featured' | 'newest' | 'cheap' | 'expensive';
const SORTS: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'پیشنهاد چوکو بار' },
  { id: 'newest', label: 'تازه‌ترین‌ها' },
  { id: 'cheap', label: 'ارزان‌ترین' },
  { id: 'expensive', label: 'گران‌ترین' },
];

const isFilter = (v: string | null): v is Filter => FILTERS.some((f) => f.id === v);

// Persian/Arabic letter variants and digits normalised so search is forgiving.
const norm = (t: string) =>
  t
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[‌\s]+/g, ' ')
    .trim()
    .toLowerCase();

export default function AllProducts() {
  const [params, setParams] = useSearchParams();
  const filter: Filter = isFilter(params.get('cat')) ? (params.get('cat') as Filter) : 'all';
  const [sort, setSort] = useState<Sort>('featured');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE);

  const list = useMemo(() => {
    const q = norm(query);
    let r: Product[] = filter === 'all' ? products : products.filter((p) => p.category === filter);
    if (q) r = r.filter((p) => norm(`${p.name} ${p.description} ${p.categoryLabel}`).includes(q));
    const sorted = [...r];
    if (sort === 'newest') sorted.sort((a, b) => b.index - a.index);
    if (sort === 'cheap') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'expensive') sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [filter, sort, query]);

  const visible = list.slice(0, limit);
  const left = list.length - visible.length;

  const pickFilter = (f: Filter) => {
    setLimit(PAGE);
    setParams(f === 'all' ? {} : { cat: f }, { replace: true });
  };

  const count = (f: Filter) => (f === 'all' ? products.length : products.filter((p) => p.category === f).length);

  return (
    <PageShell>
      <nav className={s.crumbs} aria-label="مسیر">
        <Link to="/">خانه</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">همهٔ شیرینی‌ها</span>
      </nav>

      <header className={s.hero}>
        <div>
          <h1 className={s.heading}>ویترین کامل چوکو بار</h1>
          <p className={s.lede}>
            {faNumber(products.length)} شیرینی و نان تازه؛ بگرد، بچین و جعبهٔ خودت رو بساز.
          </p>
        </div>

        <label className={s.search}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="دنبال چه شیرینی‌ای هستی؟"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE);
            }}
          />
        </label>
      </header>

      <div className={s.toolbar}>
        <div className={s.chips} role="tablist" aria-label="دسته‌بندی">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`${s.chip} ${filter === f.id ? s.chipActive : ''}`}
              onClick={() => pickFilter(f.id)}
            >
              {f.id === 'all' ? 'همه' : f.label}
              <span className={s.chipCount}>{faNumber(count(f.id))}</span>
            </button>
          ))}
        </div>

        <label className={s.sort}>
          مرتب‌سازی:
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as Sort);
              setLimit(PAGE);
            }}
          >
            {SORTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length ? (
        <div className={c.grid}>
          {visible.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className={s.empty}>
          <p className={s.emptyIcon} aria-hidden>
            🥐
          </p>
          <p className={s.emptyTitle}>این یکی هنوز توی فره!</p>
          <p className={s.emptyCopy}>با کلمهٔ دیگه‌ای بگرد یا دسته‌بندی رو عوض کن.</p>
          <button className={s.more} onClick={() => setQuery('')}>
            پاک کردن جستجو
          </button>
        </div>
      )}

      {list.length > 0 && (
        <footer className={s.pager}>
          <p className={s.progressLabel}>
            {faNumber(visible.length)} از {faNumber(list.length)} شیرینی رو دیدی
          </p>
          <div className={s.progress} aria-hidden>
            <span style={{ width: `${(visible.length / list.length) * 100}%` }} />
          </div>
          {left > 0 ? (
            <button className={s.more} onClick={() => setLimit((n) => n + PAGE)}>
              سینی بعدی رو از فر دربیار
              <span className={s.moreCount}>+{faNumber(Math.min(PAGE, left))}</span>
            </button>
          ) : (
            <p className={s.done}>به ته ویترین رسیدی؛ فردا صبح با پخت تازه برمی‌گردیم! 🍞</p>
          )}
        </footer>
      )}
    </PageShell>
  );
}
