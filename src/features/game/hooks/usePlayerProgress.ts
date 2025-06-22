import { useState, useEffect, useRef } from "react";
import { Player } from "../entities/Player";
import { getExperienceToNextLevel, frameSizes } from "../utils/player";

interface PlayerProgressData {
  level: number;
  experience: number;
  maxExperience: number;
  collectedItems: number;
}

export const usePlayerProgress = (player: Player | null) => {
  const [progressData, setProgressData] = useState<PlayerProgressData>({
    level: 1,
    experience: 0,
    maxExperience: getExperienceToNextLevel(),
    collectedItems: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!player) {
      return;
    }

    // Функция для обновления данных прогресса
    const updateProgress = () => {
      const level = player.getLevel();
      const experience = player.getExperience();
      const collectedItems = player.getCollectedItems();

      // Для максимального уровня показываем текущий опыт без ограничений
      const maxExperience =
        level >= frameSizes.length
          ? Math.max(experience, getExperienceToNextLevel())
          : getExperienceToNextLevel();

      setProgressData({
        level,
        experience,
        maxExperience,
        collectedItems,
      });
    };

    // Обновляем данные сразу
    updateProgress();

    // Устанавливаем интервал для регулярного обновления
    intervalRef.current = setInterval(updateProgress, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [player]);

  return progressData;
};
