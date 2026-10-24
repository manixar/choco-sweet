import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { CheckoutProgress, OptionTile, OrderedPastry, OrderSummary, PageIntro, ui } from '../components/ui';
import { useCart } from '../state/cart';
import { faNumber, toman } from '../lib/format';
import l from './layout.module.css';
import s from './Review.module.css';

export default function Review() {
  const navigate = useNavigate();
  const { lines } = useCart();
  const [payment, setPayment] = useState<'online' | 'wallet'>('online');
  const [accepted, setAccepted] = useState(true);

  return (
    <PageShell>
      <div className={l.grid}>
        <div className={l.intro}>
          <PageIntro
            eyebrow="بازبینی نهایی جعبهٔ شما"
            title="یک قدم تا اولین گاز"
            copy="نشانی، زمان تحویل و انتخاب‌ها را بررسی کنید؛ سپس روش پرداخت را انتخاب کنید."
          />
        </div>
        <div className={l.fullRow}>
          <CheckoutProgress current={3} />
        </div>

        <div className={`${l.mainCol} ${s.column}`}>
          <section className={`${ui.card} ${s.shipping}`} aria-label="اطلاعات تحویل">
            <div className={s.shippingHead}>
              <h2 className={s.recipient}>تحویل به مشتری نمونه</h2>
              <Link to="/checkout/shipping" className={s.edit}>
                ویرایش اطلاعات
              </Link>
            </div>
            <p className={s.address}>تهران، خیابان نمونه، پلاک ۱۲، واحد ۳ (آدرس نمایشی)</p>
            <div className={s.preview}>
              <p className={s.schedule}>
                <Icon src="icons/truck-18-lime.svg" size={18} />
                پیک محافظ تازگی • جمعه ۱ آبان، ۱۰ تا ۱۲
              </p>
              <p className={s.phone}>
                همراه: <bdi dir="ltr">۰۹•• ••• ••••</bdi>
              </p>
            </div>
            <p className={s.note}>یادداشت شما: لطفاً پیش از رسیدن تماس بگیرید.</p>
          </section>

          <div className={ui.pastryRow}>
            {lines.map(({ product, qty }) => (
              <OrderedPastry
                key={product.slug}
                name={product.name}
                meta={`${faNumber(qty)} عدد • ${toman(product.price * qty)}`}
                image={product.images.thumb ?? product.images.portrait}
              />
            ))}
          </div>

          <section className={`${ui.card} ${s.payment}`} aria-label="روش پرداخت">
            <h2 className={s.paymentHeading}>روش پرداخت</h2>
            <div className={s.options}>
              <OptionTile name="payment" selected={payment === 'online'} onSelect={() => setPayment('online')} className={s.option}>
                <span className={s.optionText}>
                  <span className={`${s.optionTitle} ${payment === 'online' ? s.optionSelectedTitle : ''}`}>
                    پرداخت آنلاین امن
                  </span>
                  <span className={`${s.optionHint} ${payment === 'online' ? s.optionSelectedHint : ''}`}>
                    با کارت‌های عضو شتاب
                  </span>
                </span>
              </OptionTile>
              <OptionTile name="payment" selected={payment === 'wallet'} onSelect={() => setPayment('wallet')} className={s.option}>
                <span className={s.optionText}>
                  <span className={`${s.optionTitle} ${payment === 'wallet' ? s.optionSelectedTitle : ''}`}>
                    کیف پول چوکو بار
                  </span>
                  <span className={`${s.optionHint} ${payment === 'wallet' ? s.optionSelectedHint : ''}`}>
                    موجودی: ۰ تومان • نیاز به شارژ
                  </span>
                </span>
              </OptionTile>
            </div>
            <label className={s.terms}>
              <input
                type="checkbox"
                className="visually-hidden"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span className={`${s.checkbox} ${accepted ? '' : s.checkboxOff}`} aria-hidden>
                ✓
              </span>
              شرایط خرید و ارسال چوکو بار را می‌پذیرم.
            </label>
          </section>
        </div>

        <div className={l.asideCol}>
          <OrderSummary
            actionLabel="ثبت سفارش و پرداخت"
            onAction={() => {
              if (accepted) navigate('/order/confirmed');
            }}
          />
        </div>
      </div>
    </PageShell>
  );
}
