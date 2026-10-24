import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { Action, OrderedPastry, ui } from '../components/ui';
import { sampleOrder as o } from '../data/order';
import { asset } from '../lib/format';
import s from './Confirmation.module.css';

export default function Confirmation() {
  return (
    <PageShell>
      <div className={s.grid}>
        <div className={s.content}>
          <header className={s.heading}>
            <div className={s.statement}>
              <span className={s.seal}>
                <Icon src="icons/check-32.svg" size={32} />
              </span>
              <div className={s.statementCopy}>
                <p className={s.eyebrow}>نمونه سفارش • پرداخت موفق</p>
                <h1 className={s.title}>لحظهٔ شیرین شما ثبت شد.</h1>
              </div>
            </div>
            <p className={s.lede}>ممنون از انتخاب چوکو بار؛ جعبهٔ شما برای پخت و آماده‌سازی برنامه‌ریزی شد.</p>
          </header>

          <section className={`${ui.card} ${s.receipt}`} aria-label="جزئیات سفارش">
            <div className={s.receiptHead}>
              <h2 className={s.receiptTitle}>جزئیات سفارش شما</h2>
              <p className={s.orderNumber} dir="ltr">
                {o.number}
              </p>
            </div>

            <div className={ui.pastryRow}>
              {o.items.map((it) => (
                <OrderedPastry key={it.name} {...it} />
              ))}
            </div>

            <div className={ui.divider} />

            <div className={s.paid}>
              <div className={s.paidStatus}>
                <p className={s.paidLabel}>{o.paidVia}</p>
                <p className={s.paidDate}>{o.paidAt}</p>
              </div>
              <div className={s.paidAmount}>
                <p className={s.amount}>{o.total}</p>
                <p className={s.breakdown}>{o.breakdown}</p>
              </div>
            </div>

            <div className={ui.divider} />

            <div className={s.delivery}>
              <p className={s.deliveryDate}>تحویل {o.deliveryWindow}</p>
              <p className={s.deliveryAddress}>
                {o.recipient} • {o.address}
              </p>
              <p className={s.deliveryType}>پیک محافظ تازگی • جعبهٔ محافظ مخصوص شیرینی</p>
            </div>
          </section>

          <div className={s.actions}>
            <Action icon="icons/package-search.svg" to="/order/tracking" className={s.actionTrack}>
              پیگیری آماده‌سازی و ارسال
            </Action>
            <Action icon="icons/arrow-right-light.svg" variant="secondary" to="/" className={s.actionBack}>
              بازگشت به کالکشن
            </Action>
          </div>
        </div>

        <aside className={`${ui.card} ${s.gift}`} aria-label="بسته‌بندی چوکو بار">
          <img src={asset('decor/packaging-glow.svg')} alt="" aria-hidden className={s.giftGlow} />
          <p className={s.giftBrand}>چوکو بار</p>
          <p className={s.giftOverline}>با ظرافت پخته، با عشق بسته‌بندی می‌شود</p>
          <img src={asset('decor/gift-box.png')} alt="جعبهٔ هدیهٔ چوکو بار" className={s.giftBox} />
          <div className={s.giftMessage}>
            <p className={s.giftHeading}>یک جعبه، سه لحظهٔ شیرین</p>
            <p className={s.giftCopy}>از دست‌های قناد ما تا خانهٔ شما؛ تازه، ظریف و آمادهٔ لذت بردن.</p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
