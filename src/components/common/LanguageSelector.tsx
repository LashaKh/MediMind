import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { SUPPORTED_LANGUAGES } from '../../i18n/config';
import type { Language } from '../../types/i18n';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Force reload to apply translations
    window.location.reload();
  };

  return (
    <button
      onClick={() => handleLanguageChange(currentLanguage === 'en' ? 'ka' : 'en')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
    >
      <span className="text-sm">
        {currentLanguage === 'en' ? '🇺🇸' : '🇬🇪'}
      </span>
      <span className="text-sm">
        {SUPPORTED_LANGUAGES[currentLanguage].name}
      </span>
    </button>
  );
};