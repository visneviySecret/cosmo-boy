import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ruTranslations from "./locales/ru.json";
import enTranslations from "./locales/en.json";

// Ключ для сохранения языка в localStorage
const LANGUAGE_STORAGE_KEY = "cosmo-boy-language";

// Определяем регионы для русского языка
const russianRegions = [
  "RU",
  "BY",
  "KZ",
  "UA",
  "AM",
  "AZ",
  "GE",
  "KG",
  "MD",
  "TJ",
  "TM",
  "UZ",
];

// Функция для определения языка по умолчанию
const getDefaultLanguage = (): string => {
  // Сначала проверяем сохраненный язык в localStorage
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage && (savedLanguage === "ru" || savedLanguage === "en")) {
    return savedLanguage;
  }

  // Если нет сохраненного языка, определяем по региону пользователя
  const userLocale = navigator.language || navigator.languages?.[0];

  if (userLocale) {
    // Извлекаем код страны из локали (например, "ru-RU" -> "RU")
    const countryCode = userLocale.split("-")[1]?.toUpperCase();
    const languageCode = userLocale.split("-")[0]?.toLowerCase();

    // Если язык русский или регион русскоязычный, возвращаем русский
    if (
      languageCode === "ru" ||
      (countryCode && russianRegions.includes(countryCode))
    ) {
      return "ru";
    }
  }

  // По умолчанию английский
  return "en";
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: ruTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    lng: getDefaultLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
  });

// Сохраняем язык в localStorage при его изменении
i18n.on("languageChanged", (lng) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
});

export default i18n;
