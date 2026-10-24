import { useLayoutEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { Action, ui } from '../components/ui';
import { getProduct, products } from '../data/products';
import { useCart } from '../state/cart';
import { asset, faIndex, toman } from '../lib/format';
import s from './Product.module.css';

const STAGE_WIDTH = 1344;

function useStageScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / STAGE_WIDTH)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, scale };
}

export default function Product() {
  const { slug = '' } = useParams();
  const product = getProduct(slug);
  const { add } = useCart();
  const [showLayers, setShowLayers] = useState(true);
  const { ref, scale } = useStageScale();

  if (!product || !product.hasPage) return <Navigate to="/" replace />;

  return (
    <PageShell watermark="bold" ambient={product.ambient} footer={false}>
      <div ref={ref} className={s.viewport} style={{ ['--scale' as string]: scale }}>
        <div className={s.stage}>
          {/* Layers in Figma stacking order, bottom → top */}
          <div className={`${s.abs} ${s.shadow}`} aria-hidden>
            <img src={asset('decor/floating-shadow.svg')} alt="" />
          </div>
          <img src={asset('decor/precision-orbit.svg')} alt="" aria-hidden className={`${s.abs} ${s.precisionOrbit}`} />
          <img src={asset('decor/inner-orbit.svg')} alt="" aria-hidden className={`${s.abs} ${s.innerOrbit}`} />
          <img src={asset(product.images.floating!)} alt={product.name} className={`${s.abs} ${s.pastry}`} />

          <section className={`${s.abs} ${s.story}`}>
            <p className={s.category}>
              <span className={s.accent} aria-hidden />
              {product.categoryLabel}
            </p>
            <h1 className={s.title}>
              <span>{product.titleLines[0]}</span>
              <span>{product.titleLines[1]}</span>
            </h1>
            <p className={s.description}>{product.description}</p>
            <div className={s.purchase}>
              <Action icon="icons/plus-18-dark.svg" block onClick={() => add(product.slug)}>
                افزودن به جعبه • {toman(product.price)}
              </Action>
              <Action
                icon="icons/layers.svg"
                variant="secondary"
                block
                onClick={() => setShowLayers((v) => !v)}
              >
                نمای لایه‌ها و ترکیبات
              </Action>
              <p className={s.allergens}>{product.allergens}</p>
            </div>
          </section>

          <section className={`${s.abs} ${s.specs} ${ui.card} ${ui.glass}`} aria-label="شناسنامهٔ پخت">
            <div className={s.specsHeading}>
              <span>شناسنامهٔ پخت</span>
              <Icon src="icons/freshness-dot.svg" size={5} />
            </div>
            <Spec icon="icons/weight.svg" label="وزن خالص" value={product.specs.weight} />
            <Spec icon="icons/thermometer.svg" label="دمای سرو" value={product.specs.serveTemp} />
            <Spec icon="icons/timer.svg" label="تخمیر خمیر" value={product.specs.proof} last />
          </section>

          <div className={`${s.annotations} ${showLayers ? '' : s.annotationsHidden}`} aria-hidden={!showLayers}>
            <div className={`${s.abs} ${s.leaderTop}`}>
              <img src={asset('decor/leader-top.svg')} alt="" />
            </div>
            <div className={`${s.abs} ${s.leaderBottom}`}>
              <img src={asset('decor/leader-bottom.svg')} alt="" />
            </div>
            <p className={`${s.abs} ${s.tooltip} ${s.tooltipTop}`}>
              <Icon src="decor/ingredient-dot.svg" size={4} />
              {product.ingredients.top}
            </p>
            <Icon src="decor/hotspot-halo.svg" size={24} className={`${s.abs} ${s.halo} ${s.haloTop}`} />
            <Icon src="decor/hotspot.svg" size={6} className={`${s.abs} ${s.dotTop}`} />
            <p className={`${s.abs} ${s.tooltip} ${s.tooltipBottom}`}>
              <Icon src="decor/ingredient-dot.svg" size={4} />
              {product.ingredients.bottom}
            </p>
            <Icon src="decor/hotspot-halo.svg" size={24} className={`${s.abs} ${s.halo} ${s.haloBottom}`} />
            <Icon src="decor/hotspot.svg" size={6} className={`${s.abs} ${s.dotBottom}`} />
          </div>

          <p className={`${s.abs} ${s.caption}`}>
            <span className={s.rule} />
            هزار لایه ظرافت، یک لحظه لذت
            <span className={s.rule} />
          </p>

          <p className={`${s.abs} ${s.indicator}`} dir="ltr">
            {faIndex(product.index)} / {faIndex(products.length)}
          </p>

          <nav className={`${s.abs} ${s.dock}`} aria-label="کالکشن شیرینی‌ها">
            {products.map((p) => {
              const label = `${faIndex(p.index)}. ${p.name}`;
              const active = p.slug === product.slug;
              const cls = `${s.choice} ${active ? s.choiceActive : ''}`;
              return p.hasPage ? (
                <Link key={p.slug} to={`/product/${p.slug}`} className={cls} aria-current={active ? 'page' : undefined}>
                  {label}
                </Link>
              ) : (
                <span key={p.slug} className={cls} title="صفحهٔ این محصول در فایل طراحی نیست">
                  {label}
                </span>
              );
            })}
          </nav>
        </div>
      </div>
    </PageShell>
  );
}

function Spec({ icon, label, value, last }: { icon: string; label: string; value: string; last?: boolean }) {
  return (
    <div className={s.spec}>
      <div className={s.metric}>
        <div className={s.metricInfo}>
          <span className={s.metricLabel}>{label}</span>
          <span className={s.metricValue}>{value}</span>
        </div>
        <Icon src={icon} size={20} />
      </div>
      {!last && <div className={ui.divider} />}
    </div>
  );
}

