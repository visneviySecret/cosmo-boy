import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

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

// Переводы русского языка
const ruTranslations = {
  game: {
    title: "Cosmo Boy",
    audioPrompt: "🎵 Кликните в любом месте для включения музыки",
    progressBar: {
      title: "Шкала толстоты - Уровень {{level}}",
      max: "(МАКС)",
      remaining: "(осталось: {{remaining}})",
      maxLevel: "(максимальный уровень)",
    },
  },
  menu: {
    newGame: "Новая игра",
    continue: "Продолжить",
    settings: "Настройки",
    developer: "Разработчик",
    close: "Закрыть",
    save: "Сохранить",
    languageSwitch: "Язык",
  },
  settings: {
    title: "Настройки",
    volume: "Громкость звука",
    language: "Язык",
  },
  credits: {
    close: "Закрыть",
    development: "Разработка",
    gameDesign: "Игровая механика и программирование",
    graphicDesign: "Графический дизайн и анимация",
    soundDesign: "Звуковое оформление",
    technologies: "Технологии",
    phaser: "Phaser.js - игровой движок",
    react: "React - пользовательский интерфейс",
    typescript: "TypeScript - разработка",
    styledComponents: "Styled Components - стилизация",
    specialThanks: "Особая благодарность",
    playersMessage:
      "Всем игрокам, которые отправились в это космическое путешествие",
    communityMessage: "Сообществу разработчиков за поддержку и вдохновение",
    story: "История космонавта",
    storyLine1:
      "Маленький космонавт начал свой путь как крошечный исследователь",
    storyLine2: "Питаясь космической едой, он рос и становился сильнее",
    storyLine3: "Преодолевая препятствия и избегая опасностей",
    storyLine4: "Он достиг своей цели и стал настоящим толстячком космоса",
    final: "Финал",
    thankYou: "Спасибо за игру!",
    cosmosWaits: "Космос ждет новых героев...",
    copyright: "© 2025 Cosmo Boy Game",
  },
  editor: {
    play: "Играть",
    editor: "Редактор",
    menu: "Меню",
    platforms: {
      asteroid: "Астероид",
      putinWeb: "Паутина Путина",
      selectPlatform: "Выберите платформу",
    },
    collectables: {
      food1: "Еда +1",
      food5: "Еда +5",
      browny: "Брауни",
      selectItem: "Выберите предмет",
    },
    faq: {
      title: "Основные функции редактора:",
      selectPlatform: "• Выберите тип платформы слева (Астероид)",
      placeObject: "• Кликните левой кнопкой мыши для размещения объекта",
      resizeObject: "• Используйте колесо мыши для изменения размера объекта",
      dragObject: "• Перетаскивайте объекты, удерживая левую кнопку мыши",
      resetObject: "• Нажмите правую кнопку мыши для сброса объекта",
      deleteObject: "• Нажмите Delete для удаления выбранного объекта",
      cameraTitle: "Управление камерой:",
      cameraLeft: "• Клавиша A - перемещение камеры влево",
      cameraRight: "• Клавиша D - перемещение камеры вправо",
      saveLoadTitle: "Сохранение и загрузка:",
      saveLoadDesc:
        '• Нажмите кнопку "Меню" для доступа к сохранению и загрузке уровней',
      createLevels:
        "• Создавайте новые уровни, загружайте существующие или удаляйте их",
    },
  },
  levelSelect: {
    title: "Выбор уровня",
    createNew: "Создать новый уровень",
    level: "Уровень {{id}}",
    deleteConfirm: "Уровень содержит объекты, действительно удалить?",
    createOnlyDemo: "Создание новых уровней доступно только в demo режиме",
    deleteOnlyDemo: "Удаление уровней доступно только в demo режиме",
    createTooltip: "Создание доступно только в demo режиме",
    deleteTooltip: "Удаление доступно только в demo режиме",
  },
  common: {
    selectValue: "Выберите значение",
    save: "Сохранить",
    close: "Закрыть",
    delete: "Удалить",
    create: "Создать",
  },
  errors: {
    sceneNotInitialized: "Сцена не инициализирована",
    levelLoadError: "Ошибка при загрузке уровня: {{error}}",
    saveError: "Ошибка при загрузке сохранения:",
  },
};

// Переводы английского языка
const enTranslations = {
  game: {
    title: "Cosmo Boy",
    audioPrompt: "🎵 Click anywhere to enable music",
    progressBar: {
      title: "Fatness Scale - Level {{level}}",
      max: "(MAX)",
      remaining: "(remaining: {{remaining}})",
      maxLevel: "(maximum level)",
    },
  },
  menu: {
    newGame: "New Game",
    continue: "Continue",
    settings: "Settings",
    developer: "Developer",
    close: "Close",
    save: "Save",
    languageSwitch: "Language",
  },
  settings: {
    title: "Settings",
    volume: "Sound Volume",
    language: "Language",
  },
  credits: {
    close: "Close",
    development: "Development",
    gameDesign: "Game mechanics and programming",
    graphicDesign: "Graphic design and animation",
    soundDesign: "Sound design",
    technologies: "Technologies",
    phaser: "Phaser.js - game engine",
    react: "React - user interface",
    typescript: "TypeScript - development",
    styledComponents: "Styled Components - styling",
    specialThanks: "Special Thanks",
    playersMessage: "To all players who embarked on this cosmic journey",
    communityMessage: "To the developer community for support and inspiration",
    story: "Astronaut's Story",
    storyLine1: "The little astronaut began his journey as a tiny explorer",
    storyLine2: "Feeding on cosmic food, he grew and became stronger",
    storyLine3: "Overcoming obstacles and avoiding dangers",
    storyLine4: "He reached his goal and became a true space fatso",
    final: "Final",
    thankYou: "Thanks for playing!",
    cosmosWaits: "Space awaits new heroes...",
    copyright: "© 2025 Cosmo Boy Game",
  },
  editor: {
    play: "Play",
    editor: "Editor",
    menu: "Menu",
    platforms: {
      asteroid: "Asteroid",
      putinWeb: "Putin's Web",
      selectPlatform: "Select platform",
    },
    collectables: {
      food1: "Food +1",
      food5: "Food +5",
      browny: "Browny",
      selectItem: "Select item",
    },
    faq: {
      title: "Basic editor functions:",
      selectPlatform: "• Select platform type on the left (Asteroid)",
      placeObject: "• Left click to place object",
      resizeObject: "• Use mouse wheel to resize object",
      dragObject: "• Drag objects while holding left mouse button",
      resetObject: "• Right click to reset object",
      deleteObject: "• Press Delete to remove selected object",
      cameraTitle: "Camera control:",
      cameraLeft: "• A key - move camera left",
      cameraRight: "• D key - move camera right",
      saveLoadTitle: "Save and load:",
      saveLoadDesc: '• Click "Menu" button to access level saving and loading',
      createLevels: "• Create new levels, load existing ones or delete them",
    },
  },
  levelSelect: {
    title: "Level Selection",
    createNew: "Create new level",
    level: "Level {{id}}",
    deleteConfirm: "Level contains objects, really delete?",
    createOnlyDemo: "Creating new levels is only available in demo mode",
    deleteOnlyDemo: "Deleting levels is only available in demo mode",
    createTooltip: "Creation is only available in demo mode",
    deleteTooltip: "Deletion is only available in demo mode",
  },
  common: {
    selectValue: "Select value",
    save: "Save",
    close: "Close",
    delete: "Delete",
    create: "Create",
  },
  errors: {
    sceneNotInitialized: "Scene is not initialized",
    levelLoadError: "Error loading level: {{error}}",
    saveError: "Error loading save:",
  },
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
