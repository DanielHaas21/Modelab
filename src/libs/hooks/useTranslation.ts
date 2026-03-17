import { TOptionsBase } from 'i18next';
import { useI18n } from './useI18N';
import { useEffect, useReducer } from 'react';

export type TranslationValue = string | number | React.ReactNode;
type TranslationOptions = TOptionsBase & Record<string, unknown>;

// The useTranslation hook is used to translate strings in the application.
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