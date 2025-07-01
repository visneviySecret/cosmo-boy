import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const LANGUAGE_STORAGE_KEY = "cosmo-boy-language";

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  };

  const getCurrentLanguage = () => {
    return i18n.language.split("-")[0];
  };

  // Загружаем сохраненный язык при инициализации
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return {
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    isRussian: getCurrentLanguage() === "ru",
    isEnglish: getCurrentLanguage() === "en",
  };
};
