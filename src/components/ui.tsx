import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { useCart } from '../state/cart';
import { asset, faNumber, toman } from '../lib/format';
import s from './ui.module.css';

export { s as ui };

/* ---------- Action ---------- */
interface ActionProps {
  children: ReactNode;
  icon?: string;
  variant?: 'primary' | 'secondary';
  block?: boolean;
  to?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

/** Pill button. The icon sits on the inline end (left in RTL), as in the design. */
export function Action({ children, icon, variant = 'primary', block, to, onClick, className, type = 'button' }: ActionProps) {
  const cls = [s.action, variant === 'primary' ? s.primary : s.secondary, block ? s.block : '', className ?? ''].join(' ');
  const content = (
    <>
      <span>{children}</span>
      {icon && <Icon src={icon} size={18} />}
    </>
  );
  return to ? (
    <Link to={to} className={cls} onClick={onClick}>
      {content}
    </Link>
  ) : (
    <button type={type} className={cls} onClick={onClick}>
      {content}
    </button>
  );
}

/* ---------- Page intro ---------- */
export function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className={s.intro}>
      <p className={s.introEyebrow}>{eyebrow}</p>
      <h1 className={s.introTitle}>{title}</h1>
      <p className={s.introCopy}>{copy}</p>
    </div>
  );
}

/* ---------- Checkout progress ---------- */
const STEPS = ['سبد خرید', 'اطلاعات و ارسال', 'بازبینی و پرداخت'];

export function CheckoutProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className={s.progress} aria-label="مراحل خرید">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = n < current ? 'done' : n === current ? 'current' : 'todo';
        const cls = state === 'done' ? s.stepDone : state === 'current' ? s.stepCurrent : s.stepTodo;
        return (
          <li key={label} className={`${s.step} ${cls}`} aria-current={state === 'current' ? 'step' : undefined}>
            <span className={s.stepIndicator}>{state === 'done' ? '✓' : faNumber(n)}</span>
            <span>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Order summary ---------- */
export function OrderSummary({ actionLabel, to, onAction }: { actionLabel: string; to?: string; onAction?: () => void }) {
  const { lines, count, subtotal, shipping, total } = useCart();
  return (
    <aside className={`${s.card} ${s.glass} ${s.summary}`} aria-label="خلاصهٔ سفارش">
      <h2 className={s.summaryHeading}>خلاصهٔ جعبهٔ شما</h2>
      <p className={s.summaryCount}>
        {faNumber(count)} شیرینی تازه • {faNumber(lines.length)} نوع انتخاب
      </p>
      <div className={s.totalRow}>
        <span className={s.totalLabel}>جمع محصولات</span>
        <span className={s.totalAmount}>{toman(subtotal)}</span>
      </div>
      <div className={s.totalRow}>
        <span className={s.totalLabel}>ارسال در تهران</span>
        <span className={s.totalAmount}>{toman(shipping)}</span>
      </div>
      <div className={s.divider} />
      <div className={s.totalRow}>
        <span className={s.totalLabel}>مبلغ قابل پرداخت</span>
        <span className={s.totalPayable}>{faNumber(total)}</span>
      </div>
      <p className={s.currency}>تومان</p>
      <Action icon="icons/arrow-left-dark.svg" block to={to} onClick={onAction}>
        {actionLabel}
      </Action>
      <p className={s.assurance}>
        <Icon src="icons/shield-check.svg" size={15} />
        پرداخت امن • قیمت نهایی و شفاف
      </p>
    </aside>
  );
}

/* ---------- Ordered pastry ---------- */
export function OrderedPastry({ name, meta, image }: { name: string; meta: string; image: string }) {
  return (
    <div className={s.pastry}>
      <img src={asset(image)} alt="" className={s.pastryImage} />
      <div className={s.pastryInfo}>
        <p className={s.pastryName}>{name}</p>
        <p className={s.pastryMeta}>{meta}</p>
      </div>
    </div>
  );
}

/* ---------- Radio option tile ---------- */
export function OptionTile({
  selected,
  onSelect,
  children,
  name,
  className,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  name: string;
  className?: string;
}) {
  return (
    <label className={`${s.option} ${selected ? s.optionSelected : ''} ${className ?? ''}`}>
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="visually-hidden" />
      <Icon src={selected ? 'icons/radio-selected.svg' : 'icons/radio.svg'} size={16} />
      {children}
    </label>
  );
}
