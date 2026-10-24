import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { Action, PageIntro, ui } from '../components/ui';
import { sampleOrder as o } from '../data/order';
import { asset } from '../lib/format';
import l from './layout.module.css';
import s from './Tracking.module.css';

type MilestoneState = 'done' | 'current' | 'pending';

const MILESTONES: { title: string; time: string; state: MilestoneState; icon: string }[] = [
  { title: 'ثبت و پرداخت سفارش', time: 'جمعه ۱ آبان • ساعت ۰۹:۱۰', state: 'done', icon: 'icons/check-16-dark.svg' },
  { title: 'پخت و بسته‌بندی تازه', time: 'جمعه ۱ آبان • ساعت ۰۹:۳۵', state: 'done', icon: 'icons/check-16-dark.svg' },
  { title: 'در مسیر شما', time: 'تحویل به پیک • ساعت ۱۰:۰۵', state: 'current', icon: 'icons/truck-16-lime.svg' },
  { title: 'تحویل درِ خانه', time: 'زمان تخمینی: امروز ساعت ۱۰:۴۵', state: 'pending', icon: 'icons/package-check.svg' },
];

export default function Tracking() {
  return (
    <PageShell>
      <div className={l.grid}>
        <div className={l.intro} style={{ gridRow: 1 }}>
          <PageIntro
            eyebrow={`نمونه سفارش • ${o.number}`}
            title="لذت، در مسیر شماست."
            copy="از آخرین لایهٔ خمیر تا زنگ در؛ مسیر جعبه‌تان را اینجا ببینید."
          />
        </div>
        <div className={s.arrival}>
          <Icon src="icons/clock.svg" size={30} />
          <div className={s.arrivalInfo}>
            <p className={s.arrivalLabel}>زمان تخمینی رسیدن</p>
            <p className={s.arrivalTime}>امروز، ساعت ۱۰:۴۵</p>
          </div>
        </div>
        <div className={`${l.fullRow} ${s.banner}`} role="status">
          <p className={s.status}>
            <Icon src="icons/live-dot.svg" size={6} className={s.live} />
            سفارش شما به پیک تحویل داده شد
          </p>
          <p className={s.disclaimer}>اطلاعات این صفحه نمایشی است؛ مرسولهٔ واقعی نیست.</p>
        </div>
      </div>

      <div className={s.columns}>
        {/* Order timeline (right) */}
        <section className={ui.card} aria-labelledby="timeline-title">
          <ol className={s.timeline}>
            <li>
              <h2 id="timeline-title" className={s.timelineTitle}>
                مسیر سفارش
              </h2>
            </li>
            {MILESTONES.map((m, i) => (
              <li key={m.title} className={s.milestone}>
                <div className={s.marker}>
                  <span
                    className={`${s.ring} ${m.state === 'done' ? s.ringDone : m.state === 'current' ? s.ringCurrent : ''}`}
                  >
                    <Icon src={m.icon} size={16} />
                  </span>
                  {i < MILESTONES.length - 1 && (
                    <span className={`${s.connector} ${m.state === 'done' ? s.connectorDone : ''}`} />
                  )}
                </div>
                <div className={s.milestoneText}>
                  <p
                    className={`${s.milestoneTitle} ${
                      m.state === 'current' ? s.titleCurrent : m.state === 'pending' ? s.titlePending : ''
                    }`}
                  >
                    {m.title}
                  </p>
                  <p className={s.milestoneTime}>{m.time}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Route + support (middle) */}
        <div className={s.middle}>
          <section className={`${ui.card} ${s.route}`} aria-label="مسیر ارسال">
            <img src={asset('decor/route-contour-4.svg')} alt="" className={`${s.routeLayer} ${s.c1}`} />
            <img src={asset('decor/route-contour-3.svg')} alt="" className={`${s.routeLayer} ${s.c2}`} />
            <img src={asset('decor/route-contour-2.svg')} alt="" className={`${s.routeLayer} ${s.c3}`} />
            <img src={asset('decor/route-contour-1.svg')} alt="" className={`${s.routeLayer} ${s.c4}`} />
            <h2 className={s.routeTitle}>از کارگاه تا خانهٔ شما</h2>
            <img src={asset('decor/route-planned.png')} alt="" width={300} height={147} className={s.planned} />
            <img src={asset('decor/route-completed.svg')} alt="" className={s.completed} />
            <span className={`${s.pin} ${s.bakery}`} title="کارگاه چوکو بار">
              <Icon src="icons/croissant.svg" size={22} />
            </span>
            <span className={`${s.pin} ${s.courier}`} title="پیک">
              <Icon src="icons/truck-courier.svg" size={23} />
            </span>
            <span className={`${s.pin} ${s.home}`} title="مقصد">
              <Icon src="icons/house.svg" size={18} />
            </span>
            <p className={s.routeNote}>نمای شماتیک مسیر • موقعیت واقعی پیک نیست</p>
          </section>

          <section className={`${ui.card} ${s.support}`}>
            <p className={s.supportTitle}>برای تحویل، کنار شما هستیم.</p>
            <Action icon="icons/message-circle.svg" variant="secondary" block>
              گفت‌وگو با پشتیبانی
            </Action>
          </section>
        </div>

        {/* Shipment details (left) */}
        <section className={`${ui.card} ${s.details}`} aria-label="مشخصات مرسوله">
          <div className={s.detailsHead}>
            <h2 className={s.detailsTitle}>مشخصات مرسوله</h2>
            <p className={s.detailsNumber} dir="ltr">
              {o.number}
            </p>
          </div>
          <div className={s.thumbs}>
            <img src={asset('products/portrait-pistachio.png')} alt="نیویورک رول پسته" className={s.thumb} />
            <img src={asset('products/thumb-butter-croissants.png')} alt="کروسان کره‌ای" className={s.thumb} />
          </div>
          <div className={`${s.stack} ${s.contents}`}>
            <p className={s.strong}>۱ رول پسته + ۲ کروسان کره‌ای</p>
            <p className={s.small}>۱ جعبهٔ محافظ • ۳ شیرینی</p>
          </div>
          <div className={ui.divider} />
          <div className={`${s.stack} ${s.recipient}`}>
            <p className={s.strong}>گیرنده: {o.recipient}</p>
            <p className={s.address}>{o.address}</p>
            <p className={s.window}>{o.deliveryWindow}</p>
          </div>
          <div className={ui.divider} />
          <div className={s.paidRow}>
            <p className={s.small}>پرداخت‌شده</p>
            <p className={s.paidAmount}>{o.total}</p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
