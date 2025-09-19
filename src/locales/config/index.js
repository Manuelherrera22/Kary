import { esTranslations } from './es';
import { enTranslations } from './en';
import { frTranslations } from './fr';
import { ptTranslations } from './pt';
import { ruTranslations } from './ru';
import { kzTranslations } from './kz';

export const translations = {
  es: esTranslations,
  en: enTranslations,
  fr: frTranslations,
  pt: ptTranslations,
  ru: ruTranslations,
  kz: kzTranslations,
};

export const t = (key, lang, replacements = {}, initialLangAttempt = null) => {
  // Validar que key sea una cadena válida
  if (!key || typeof key !== 'string') {
    console.warn(`Invalid translation key: ${key}`);
    return key || 'Translation key missing';
  }
  
  const keys = key.split('.');
  let MappedString = translations[lang];

  for (const k of keys) {
    if (MappedString && typeof MappedString === 'object' && k in MappedString) {
      MappedString = MappedString[k];
    } else {
      console.warn(`No translation found for key: ${key} in language: ${lang}`);
      MappedString = undefined;
      break;
    }
  }

  if (typeof MappedString !== 'string') {
    console.warn(`Translation for key: ${key} in language: ${lang} is not a string.`);
    
    const currentInitialLang = initialLangAttempt === null ? lang : initialLangAttempt;
    
    const fallbackLang = currentInitialLang === 'es' ? 'en' : 'es';

    if (lang !== fallbackLang) {
      return t(key, fallbackLang, replacements, currentInitialLang);
    }
    
    return key; 
  }

  for (const placeholder in replacements) {
    MappedString = MappedString.replace(
      new RegExp(`{${placeholder}}`, 'g'),
      replacements[placeholder]
    );
  }
  return MappedString;
};

export const getNavigatorLanguage = () => {
  if (typeof window !== 'undefined' && window.navigator) {
    const lang = window.navigator.language.split('-')[0];
    return Object.keys(translations).includes(lang) ? lang : 'es';
  }
  return 'es'; 
};

export const availableLanguages = Object.keys(translations).map(lang => ({
  code: lang,
  name: translations[lang]?.common?.languageName || lang.toUpperCase()
}));