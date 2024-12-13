import { useCallback } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import en from '../i18n/translations/en';
import ka from '../i18n/translations/ka';
import { format as formatDate } from 'date-fns';
import { ka as kaLocale } from 'date-fns/locale';
import { DATE_FORMATS, NUMBER_FORMATS } from '../i18n/config';

const translations = {
  en,
  ka
};

export const useTranslation = () => {
  const { currentLanguage } = useLanguageStore();

  const t = useCallback((key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];

    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }

    if (!value) {
      console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
        if (!value) break;
      }
    }

    if (params && typeof value === 'string') {
      return Object.entries(params).reduce(
        (acc, [key, val]) => acc.replace(`{{${key}}}`, val),
        value
      );
    }

    return value || key;
  }, [currentLanguage]);

  const formatDateTime = useCallback((date: Date, format: 'short' | 'long' | 'time' = 'short') => {
    const dateFormat = DATE_FORMATS[currentLanguage][format];
    return formatDate(date, dateFormat, {
      locale: currentLanguage === 'ka' ? kaLocale : undefined
    });
  }, [currentLanguage]);

  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    const { decimal, thousands } = NUMBER_FORMATS[currentLanguage];
    return new Intl.NumberFormat(currentLanguage, {
      ...options,
      decimal,
      thousands
    }).format(number);
  }, [currentLanguage]);

  return {
    t,
    formatDateTime,
    formatNumber,
    currentLanguage
  };
};