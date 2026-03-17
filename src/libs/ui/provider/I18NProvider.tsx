'use client';
import React from 'react';
import i18n, { ALL_LANGUAGES } from '../../../../public/i18n/i18n';
import { I18nContext } from '../../hooks/useI18N';

interface I18NProviderProps {
  children: React.ReactNode;
}

export function I18NProvider({ children }: I18NProviderProps) {
  const languages = ALL_LANGUAGES;
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
