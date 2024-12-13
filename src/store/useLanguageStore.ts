import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../i18n/config';
import type { Language } from '../types/i18n';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: DEFAULT_LANGUAGE,
      setLanguage: (language: Language) => {
        if (SUPPORTED_LANGUAGES[language]) {
          set({ currentLanguage: language });
          localStorage.setItem('language', language);
          document.documentElement.lang = language;
        }
      }
    }),
    {
      name: 'language-storage',
      getStorage: () => localStorage
    }
  )
);