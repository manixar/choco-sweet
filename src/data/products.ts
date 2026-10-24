export type Category = 'fruit' | 'chocolate' | 'classic';

export interface Product {
  slug: string;
  index: number;
  name: string;
  /** Hero title broken into two lines, as in the design */
  titleLines: [string, string];
  price: number;
  weightGrams: number;
  category: Category;
  categoryLabel: string;
  description: string;
  specs: { weight: string; serveTemp: string; proof: string };
  ingredients: { top: string; bottom: string };
  allergens: string;
  badge?: string;
  images: {
    portrait: string;
    floating?: string;
    cart?: string;
    thumb?: string;
  };
  ambient?: string;
  /** Only products with a product page in the Figma file get one. */
  hasPage: boolean;
}

export const products: Product[] = [
  {
    slug: 'butter-croissant',
    index: 1,
    name: 'کروسان کره‌ای',
    titleLines: ['کروسان', 'کره‌ای'],
    price: 120_000,
    weightGrams: 90,
    category: 'classic',
    categoryLabel: 'کالکشن وینوازری • کلاسیک فرانسوی',
    description: 'هلالی از هزار لایهٔ طلایی؛ با کرهٔ خالص، پوسته‌ای ترد و قلبی سبک و ابری.',
    specs: { weight: '۹۰ گرم', serveTemp: '۲۶ درجه', proof: '۴۸ ساعت' },
    ingredients: { top: 'کرهٔ خالص فرانسوی', bottom: 'خمیر هزارلای دست‌ساز' },
    allergens: 'حاوی گلوتن، شیر و تخم‌مرغ',
    images: {
      portrait: 'products/portrait-croissant.png',
      floating: 'products/floating-croissant.png',
      cart: 'products/cart-croissant.png',
      thumb: 'products/thumb-croissant.png',
    },
    hasPage: true,
  },
  {
    slug: 'apple-cinnamon-strudel',
    index: 2,
    name: 'اشترودل سیب و دارچین',
    titleLines: ['اشترودل', 'سیب و دارچین'],
    price: 165_000,
    weightGrams: 150,
    category: 'fruit',
    categoryLabel: 'کالکشن وینوازری • میوه‌ای و معطر',
    description: 'لایه‌های نازک و برشته، آغوشی برای سیب کاراملی و عطر گرم دارچین سیلان.',
    specs: { weight: '۱۵۰ گرم', serveTemp: '۳۰ درجه', proof: '۲۴ ساعت' },
    ingredients: { top: 'سیب کاراملی و دارچین', bottom: 'خمیر نازک و برشته' },
    allergens: 'حاوی گلوتن، شیر و گردو',
    images: {
      portrait: 'products/portrait-strudel.png',
      floating: 'products/floating-strudel.png',
    },
    hasPage: true,
  },
  {
    slug: 'pain-au-chocolat',
    index: 3,
    name: 'پن او شکلا',
    titleLines: ['پن او', 'شکلا'],
    price: 150_000,
    weightGrams: 110,
    category: 'chocolate',
    categoryLabel: 'کالکشن وینوازری • شکلاتی و عمیق',
    description: 'خمیر کره‌ای آرام‌تخمیر با دو رگه شکلات تلخ؛ تردی ظریف، پایانی عمیق و مخملی.',
    specs: { weight: '۱۱۰ گرم', serveTemp: '۲۶ درجه', proof: '۴۸ ساعت' },
    ingredients: { top: 'شکلات تلخ ۷۰ درصد', bottom: 'لایه‌های کره‌ای طلایی' },
    allergens: 'حاوی گلوتن، شیر و تخم‌مرغ',
    images: {
      portrait: 'products/portrait-pain.png',
      floating: 'products/floating-pain.png',
    },
    hasPage: true,
  },
  {
    slug: 'pistachio-new-york-roll',
    index: 4,
    name: 'نیویورک رول پسته',
    titleLines: ['نیویورک رول', 'پسته'],
    price: 240_000,
    weightGrams: 180,
    category: 'chocolate',
    categoryLabel: 'کالکشن وینوازری',
    description: '',
    specs: { weight: '۱۸۰ گرم', serveTemp: '', proof: '' },
    ingredients: { top: '', bottom: '' },
    allergens: '',
    badge: 'امضای چوکو بار',
    images: {
      portrait: 'products/portrait-pistachio.png',
      cart: 'products/portrait-pistachio.png',
      thumb: 'products/portrait-pistachio.png',
    },
    // The Figma file has no «چوکو بار» product page for this pastry.
    hasPage: false,
  },
  {
    slug: 'strawberry-danish',
    index: 5,
    name: 'دانمارکی توت‌فرنگی',
    titleLines: ['دانمارکی', 'توت‌فرنگی'],
    price: 185_000,
    weightGrams: 140,
    category: 'fruit',
    categoryLabel: 'کالکشن وینوازری • تازه و میوه‌ای',
    description: 'توت‌فرنگی‌های براق بر بستری از کرم وانیل؛ قاب طلایی خمیر، لطیف و ترد در هر گاز.',
    specs: { weight: '۱۴۰ گرم', serveTemp: '۲۰ درجه', proof: '۴۸ ساعت' },
    ingredients: { top: 'توت‌فرنگی تازه و براق', bottom: 'کرم وانیل ماداگاسکار' },
    allergens: 'حاوی گلوتن، شیر و تخم‌مرغ',
    images: {
      portrait: 'products/portrait-strawberry.png',
      floating: 'products/floating-strawberry.png',
    },
    ambient: 'decor/ambient-strawberry.svg',
    hasPage: true,
  },
  {
    slug: 'caramel-cinnamon-roll',
    index: 6,
    name: 'رول دارچین کاراملی',
    titleLines: ['رول دارچین', 'کاراملی'],
    price: 175_000,
    weightGrams: 160,
    category: 'classic',
    categoryLabel: 'کالکشن وینوازری • گرم و دلنشین',
    description: 'مارپیچی نرم از دارچین، پوشیده در کارامل کره‌ای و گردوی برشته؛ یک آغوش شیرین.',
    specs: { weight: '۱۶۰ گرم', serveTemp: '۳۰ درجه', proof: '۲۴ ساعت' },
    ingredients: { top: 'کارامل کره‌ای و گردو', bottom: 'مارپیچ دارچین سیلان' },
    allergens: 'حاوی گلوتن، شیر و گردو',
    images: {
      portrait: 'products/portrait-cinnamon.png',
      floating: 'products/floating-cinnamon.png',
    },
    hasPage: true,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const SHIPPING_FEE = 60_000;
