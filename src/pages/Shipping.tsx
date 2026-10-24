import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { CheckoutProgress, OptionTile, OrderSummary, PageIntro, ui } from '../components/ui';
import l from './layout.module.css';
import s from './Shipping.module.css';

export default function Shipping() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'courier' | 'pickup'>('courier');

  return (
    <PageShell>
      <div className={l.grid}>
        <div className={l.intro}>
          <PageIntro
            eyebrow="جزئیات یک تحویل بی‌نقص"
            title="تازگی را کجا تحویل بدهیم؟"
            copy="مشخصات گیرنده و زمان دلخواهتان را وارد کنید. اطلاعات زیر صرفاً نمایشی است."
          />
        </div>
        <div className={l.fullRow}>
          <CheckoutProgress current={2} />
        </div>

        <form
          id="shipping-form"
          className={`${l.mainCol} ${ui.card} ${s.form}`}
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/checkout/review');
          }}
        >
          <div className={s.heading}>
            <h2 className={s.headingTitle}>
              <Icon src="icons/map-pin.svg" size={20} />
              گیرنده و نشانی تحویل
            </h2>
            <p className={s.required}>فیلدهای ستاره‌دار الزامی‌اند</p>
          </div>

          <div className={s.row}>
            <Field label="نام و نام خانوادگی گیرنده *" defaultValue="مشتری نمونه" autoComplete="name" />
            <Field label="شمارهٔ همراه *" defaultValue="۰۹•• ••• ••••" dir="ltr" inputMode="tel" autoComplete="tel" />
            <Field label="شهر *" defaultValue="تهران" autoComplete="address-level2" />
          </div>

          <div className={s.row}>
            <Field
              label="نشانی کامل، پلاک و واحد *"
              defaultValue="خیابان نمونه، پلاک ۱۲، واحد ۳ (آدرس نمایشی)"
              autoComplete="street-address"
            />
            <Field label="کد پستی *" placeholder="کد پستی ۱۰ رقمی" fixed inputMode="numeric" autoComplete="postal-code" />
          </div>

          <fieldset className={s.field} style={{ border: 0, margin: 0, padding: 0 }}>
            <legend className={s.label} style={{ padding: 0, marginBottom: 7 }}>
              روش دریافت *
            </legend>
            <div className={s.options}>
              <OptionTile
                name="delivery"
                selected={method === 'courier'}
                onSelect={() => setMethod('courier')}
                className={s.option}
              >
                پیک محافظ تازگی • ۶۰٬۰۰۰ تومان
              </OptionTile>
              <OptionTile
                name="delivery"
                selected={method === 'pickup'}
                onSelect={() => setMethod('pickup')}
                className={s.option}
              >
                دریافت حضوری • رایگان
              </OptionTile>
            </div>
          </fieldset>

          <div className={s.row}>
            <Field label="روز و بازهٔ تحویل *" defaultValue="جمعه ۱ آبان • ساعت ۱۰ تا ۱۲" />
            <Field label="یادداشت سفارش (اختیاری)" defaultValue="لطفاً پیش از رسیدن تماس بگیرید." />
          </div>

          <p className={s.guidance}>شیرینی‌ها در روز تحویل پخت و با بسته‌بندی محافظ ارسال می‌شوند.</p>
        </form>

        <div className={l.asideCol}>
          <OrderSummary actionLabel="ادامه و بازبینی سفارش" to="/checkout/review" />
        </div>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  fixed,
  ...input
}: {
  label: ReactNode;
  fixed?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`${s.field} ${fixed ? s.fieldFixed : ''}`}>
      <span className={s.label}>{label}</span>
      <input className={s.input} {...input} />
    </label>
  );
}
