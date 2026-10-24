import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { getProduct, SHIPPING_FEE, type Product } from '../data/products';

export interface CartLine {
  product: Product;
  qty: number;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  add: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
}

const CartContext = createContext<CartValue | null>(null);

// Starting basket matches the Figma file: 1 pistachio roll + 2 butter croissants.
const INITIAL: { slug: string; qty: number }[] = [
  { slug: 'pistachio-new-york-roll', qty: 1 },
  { slug: 'butter-croissant', qty: 2 },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(INITIAL);

  const add = useCallback((slug: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === slug);
      return found
        ? prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { slug, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.slug !== slug) : prev.map((i) => (i.slug === slug ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);

  const value = useMemo<CartValue>(() => {
    const lines = items
      .map((i) => ({ product: getProduct(i.slug)!, qty: i.qty }))
      .filter((l) => Boolean(l.product));
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + l.qty * l.product.price, 0);
    const shipping = lines.length ? SHIPPING_FEE : 0;
    return { lines, count, subtotal, shipping, total: subtotal + shipping, add, setQty, remove };
  }, [items, add, setQty, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
