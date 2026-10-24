import type { ReactNode } from 'react';
import { Header } from './Header';
import { asset } from '../lib/format';
import s from './PageShell.module.css';

interface PageShellProps {
  children: ReactNode;
  /** soft = checkout/collection pages, bold = product pages */
  watermark?: 'soft' | 'bold';
  ambient?: string;
  footer?: boolean;
  mainClassName?: string;
}

export function PageShell({
  children,
  watermark = 'soft',
  ambient = 'decor/ambient.svg',
  footer = true,
  mainClassName,
}: PageShellProps) {
  return (
    <div className={s.frame}>
      <img src={asset(ambient)} alt="" aria-hidden className={s.ambient} />
      <p aria-hidden className={`${s.watermark} ${watermark === 'bold' ? s.watermarkBold : s.watermarkSoft}`}>
        چوکو بار
      </p>

      <Header />
      <main className={`${s.main} ${mainClassName ?? ''}`}>{children}</main>
      {footer && <ServiceFooter />}
    </div>
  );
}

export function ServiceFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.promises}>
        <span className={s.promiseAccent}>تازه از فر چوکو بار</span>
        <span>ارسال زمان‌بندی‌شده در تهران</span>
        <span>بسته‌بندی محافظ تازگی</span>
      </div>
      <span className={s.signature}>هزار لایه ظرافت، یک لحظه لذت</span>
    </footer>
  );
}
