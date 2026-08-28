import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against third-party cross-origin script errors (e.g. Disqus, ad-blockers, tracking shields)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Cross-origin script errors or Disqus third-party widget errors
    if (
      event.message === 'Script error.' ||
      (event.filename && (event.filename.includes('disqus') || event.filename.includes('clarity')))
    ) {
      // Prevent bubbling to global error overlays while logging for diagnostics
      event.preventDefault();
      console.debug('External widget script event caught safely:', event.message || event.filename);
      return true;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason || '');
    if (reasonStr.includes('disqus') || reasonStr.includes('clarity') || reasonStr.includes('Script error')) {
      event.preventDefault();
      console.debug('External widget unhandled rejection handled safely:', reasonStr);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

