import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

const languages = ['en', 'cs'] as const;
export type Language = typeof languages[number];
export const ALL_LANGUAGES = languages as unknown as Language[];

await i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: navigator.language === 'cs-CZ' ? 'cs' : 'en',
    fallbackLng: 'en',
    supportedLngs: languages,
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
