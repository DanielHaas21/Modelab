import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import i18n from '../public/i18n/i18n.ts';

import './index.css';

import { Preloader } from './libs/ui/components/Preloader.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './libs/ui/provider/AuthProvider.tsx';
import { UiProvider } from './libs/ui/provider/index.ts';
import { ThemeProvider } from './libs/ui/provider/ThemeProvider.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

(async () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Suspense fallback={<Preloader />}>
        <Provider store={store}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <UiProvider i18nValue={i18n}>
              <AuthProvider>
                <ThemeProvider>
                  <App />
                </ThemeProvider>
              </AuthProvider>
            </UiProvider>
          </GoogleOAuthProvider>
        </Provider>
      </Suspense>
    </StrictMode>
  );
})();
