import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './state/cart';
import { isStandalone, registerServiceWorker } from './pwa/pwa';
import './styles/theme.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);

registerServiceWorker();

// Installed app (home screen): no browser toolbar, so the app shows its own bottom bar.
const markStandalone = () => document.documentElement.classList.toggle('standalone', isStandalone());
markStandalone();
window.matchMedia('(display-mode: standalone)').addEventListener?.('change', markStandalone);
