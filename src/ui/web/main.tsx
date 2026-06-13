import { createRoot } from 'react-dom/client';
import { GameApp } from './GameApp';
import './styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<GameApp />);

// Register the offline service worker in production builds only (the dev server
// has no service worker, and we never want one caching HMR assets). Offline
// support is a progressive enhancement, so failures are non-fatal.
if (__PROD__ && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* Ignore: the game still works fully online without a service worker. */
    });
  });
}