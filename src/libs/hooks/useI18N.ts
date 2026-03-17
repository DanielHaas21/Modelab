import { createContext, useContext } from 'react';
import { Language } from '../../../public/i18n/i18n';
import type { i18n as I18nInstance } from 'i18next';

interface I18nContextType {
  i18n: I18nInstance;
  cycleLanguages: () => void;
  languages: Language[];
}

export const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18NProvider>');
  return ctx;
};