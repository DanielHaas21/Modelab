import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

export const ALL_LANGUAGES = ['en', 'cs'];
export type Language = typeof ALL_LANGUAGES[number];

await i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: navigator.language === 'cs-CZ' ? 'cs' : 'en',
    fallbackLng: 'en',
    supportedLngs: ALL_LANGUAGES,
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: '/i18n/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
