'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { i18n as I18nInstance, TOptionsBase } from 'i18next';
import i18n, { ALL_LANGUAGES, Language } from '../../../../public/i18n/i18n';

// It contains the useTranslation hook, which is used to translate strings in the application.

export type TranslationValue = string | number | React.ReactNode;
type TranslationOptions = TOptionsBase & Record<string, unknown>;

interface I18nContextType {
  i18n: I18nInstance;
  cycleLanguages: () => void;
  languages: Language[];
}

// I18n context
const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const i18n = useContext(I18nContext);
  if (!i18n) throw new Error('I18n not initialized');
  return i18n;
};

export const useTranslation = (root: string) => {
  const { i18n } = useI18n();
  const [, rerender] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    if (!i18n) return;
    i18n.on('languageChanged', rerender);
    i18n.store?.on('added', rerender);
    return () => {
      i18n.off('languageChanged', rerender);
      i18n.store?.off('added', rerender);
    };
  }, [i18n]);

  function t(key: string): string;
  function t(key: string, options: TranslationOptions): TranslationValue;
  function t(key: string, options?: TranslationOptions): TranslationValue {
    if (!i18n) return `${root}.${key}`;

    return i18n.t(`${root}.${key}`, options);
  }

  return t;
};

interface I18NProviderProps {
  children: React.ReactNode;
}

export function I18NProvider({ children }: I18NProviderProps) {
  const languages: Language[] = ALL_LANGUAGES as Language[];
  const i18nValue = i18n;

  const cycleLanguages = () => {
    const currentLangIndex = languages.findIndex((lang) => lang === i18nValue.language);
    i18nValue.changeLanguage(languages[(currentLangIndex + 1) % languages.length]);
  };

  return (
    <I18nContext.Provider value={{
      i18n: i18nValue,
      languages,
      cycleLanguages,
    }}>
      {children}
    </I18nContext.Provider>
  );
}
