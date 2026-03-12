import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UiProvider } from './libs/ui/provider/index.ts';
import i18n from '../public/i18n/i18n.ts';
import { Preloader } from './libs/ui/components/Preloader.tsx';
(async () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Suspense fallback={<Preloader />}>
        <UiProvider i18nValue={i18n}>
          <App />
        </UiProvider>
      </Suspense>
    </StrictMode>
  );
})();
