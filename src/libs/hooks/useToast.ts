import { createContext, useContext } from 'react';

export type ToastMessage = {
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

export const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
