'use client';
import React, { useEffect } from 'react';
import i18n, { ALL_LANGUAGES, Language } from '../../../../public/i18n/i18n';
import { I18nContext } from '../../hooks/useI18N';

interface I18NProviderProps {
  children: React.ReactNode;
}

const LS_LANGUAGE_KEY = 'i18n-current-lang' as const;

const getLanguageIndex = (language: string) => ALL_LANGUAGES.findIndex((otherLanguage) => otherLanguage === language);
const getStoredIndex = (defaultValue: number) => {
  const stored = getLanguageIndex(localStorage.getItem(LS_LANGUAGE_KEY) ?? '');
  if (!isFinite(stored) || stored < 0 || stored >= ALL_LANGUAGES.length) return defaultValue;
  return stored;
}

export function I18NProvider({ children }: I18NProviderProps) {
  const languages = ALL_LANGUAGES;
  const i18nValue = i18n;

  useEffect(() => {
    const currentIndex = getLanguageIndex(i18nValue.language);
    const storedIndex = getStoredIndex(currentIndex);

    changeLanguage(ALL_LANGUAGES[storedIndex]);
  }, [LS_LANGUAGE_KEY]);

  const changeLanguage = (language: Language) => {
    i18nValue.changeLanguage(language);
    localStorage.setItem(LS_LANGUAGE_KEY, language);
  };

  const cycleLanguages = () => {
    const language = languages[(getLanguageIndex(i18nValue.language) + 1) % languages.length];
    changeLanguage(language);
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
