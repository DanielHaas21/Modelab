import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { store } from './store/store.ts';

import './index.css';

import { Preloader } from './libs/ui/components/Preloader.tsx';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './libs/auth/AuthProvider.tsx';
import { I18NProvider, ToastProvider, ThemeProvider } from './libs/ui/provider/index.ts';
import { Provider } from 'react-redux';

(async () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Suspense fallback={<Preloader />}>
        <Provider store={store}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <I18NProvider>
              <ToastProvider>
                <AuthProvider>
                  <ThemeProvider>
                    <App />
                  </ThemeProvider>
                </AuthProvider>
              </ToastProvider>
            </I18NProvider>
          </GoogleOAuthProvider>
        </Provider>
      </Suspense>
    </StrictMode>
  );
})();
