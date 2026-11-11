import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Collection from './pages/Collection/Collection';
import Product from './pages/Product/Product';
import Cart from './pages/Cart/Cart';
import Shipping from './pages/Shipping/Shipping';
import Review from './pages/Review/Review';
import Confirmation from './pages/Confirmation/Confirmation';
import Tracking from './pages/Tracking/Tracking';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Collection />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/shipping" element={<Shipping />} />
        <Route path="/checkout/review" element={<Review />} />
        <Route path="/order/confirmed" element={<Confirmation />} />
        <Route path="/order/tracking" element={<Tracking />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
