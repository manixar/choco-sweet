import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { Action, CheckoutProgress, OrderSummary, PageIntro, ui } from '../components/ui';
import { SHIPPING_FEE } from '../data/products';
import { useCart } from '../state/cart';
import { asset, faNumber, toman } from '../lib/format';
import l from './layout.module.css';
import s from './Cart.module.css';

export default function Cart() {
  const { lines, setQty, remove } = useCart();

  return (
    <PageShell>
      <div className={l.grid}>
        <div className={l.intro}>
          <PageIntro
            eyebrow="از فر ما تا لحظهٔ شما"
            title="جعبهٔ خوش‌سلیقهٔ شما"
            copy="انتخاب‌هایتان را مرور کنید؛ ما هر لایه را تازه برای شما آماده می‌کنیم."
          />
        </div>
        <div className={l.fullRow}>
          <CheckoutProgress current={1} />
        </div>

        <section className={`${l.mainCol} ${s.items}`} aria-label="اقلام سبد">
          {lines.length === 0 && (
            <div className={`${ui.card} ${s.empty}`}>
              <p>جعبهٔ شما هنوز خالی است.</p>
              <Action to="/" variant="secondary">
                رفتن به کالکشن شیرینی‌ها
              </Action>
            </div>
          )}

          {lines.map(({ product, qty }) => (
            <article key={product.slug} className={`${ui.card} ${s.item}`}>
              <img src={asset(product.images.cart ?? product.images.portrait)} alt={product.name} className={s.image} />
              <div className={s.info}>
                <h2 className={s.name}>{product.name}</h2>
                <p className={s.unit}>
                  هر عدد {toman(product.price)} • {faNumber(product.weightGrams)} گرم
                </p>
                <div className={s.qty}>
                  <button className={s.qtyButton} onClick={() => setQty(product.slug, qty + 1)} aria-label="افزایش">
                    <Icon src="icons/plus-14-light.svg" size={14} />
                  </button>
                  <span aria-live="polite">{faNumber(qty)}</span>
                  <button className={s.qtyButton} onClick={() => setQty(product.slug, qty - 1)} aria-label="کاهش">
                    <Icon src="icons/minus.svg" size={14} />
                  </button>
                </div>
              </div>
              <div className={s.lineTotal}>
                <p className={s.price}>{toman(product.price * qty)}</p>
                <button className={s.remove} onClick={() => remove(product.slug)}>
                  <Icon src="icons/trash.svg" size={14} />
                  حذف از جعبه
                </button>
              </div>
            </article>
          ))}

          <div className={s.delivery}>
            <Icon src="icons/truck-26.svg" size={26} />
            <div className={s.deliveryText}>
              <p className={s.deliveryTitle}>تازگی، تا درِ خانه</p>
              <p className={s.deliveryCopy}>بازهٔ تحویل را در مرحلهٔ بعد انتخاب کنید؛ ارسال ویژهٔ تهران.</p>
            </div>
            <p className={s.estimate}>برآورد ارسال: {toman(SHIPPING_FEE)}</p>
          </div>

          <Link to="/" className={s.back}>
            <Icon src="icons/arrow-right-16.svg" size={16} />
            بازگشت به کالکشن شیرینی‌ها
          </Link>
        </section>

        <div className={l.asideCol}>
          <OrderSummary actionLabel="ادامه و انتخاب ارسال" to={lines.length ? '/checkout/shipping' : undefined} />
        </div>
      </div>
    </PageShell>
  );
}
