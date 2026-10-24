const nf = new Intl.NumberFormat('fa-IR', { useGrouping: true });

/** 240000 → «۲۴۰٬۰۰۰» */
export const faNumber = (n: number) => nf.format(n);

/** 240000 → «۲۴۰٬۰۰۰ تومان» */
export const toman = (n: number) => `${faNumber(n)} تومان`;

/** 5 → «۰۵» */
export const faIndex = (n: number) =>
  new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2, useGrouping: false }).format(n);

/** Public asset path (files downloaded by `npm run assets`). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;
