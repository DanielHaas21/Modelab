'use client';
import * as React from 'react';
import { Toast } from '../components/Toast/Toast';
import { uid } from 'uid';

type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  tint?: boolean;
  duration?: number;
  actions?: React.ReactNode;
  progressBar?: number;
};

type ToastContextType = {
  show: (toast: Omit<ToastMessage, 'id'>) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

/**
 * A provider component that manages the state of toasts and provides a function to show new toasts. It renders the Toast component and passes the current toasts as children. 
 * The show function can be used to add new toasts, which will automatically disappear after a specified duration (default is 5000ms). Each toast has a unique ID generated using the uid library.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const show = React.useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = uid();

    const newToast: ToastMessage = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration ?? 5000);
    }
  }, []);

  const remove = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastsRender = toasts.map((t) => (
    <Toast.Item
      key={t.id}
      variant={t.variant ?? 'success'}
      description={t.description}
      progressBar={t.progressBar}
      actions={t.actions}
      onRemove={() => remove(t.id)}
    >
      {t.title}
    </Toast.Item>
  ))

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 right-4 z-50">
        <Toast>
          {toastsRender}
        </Toast>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
