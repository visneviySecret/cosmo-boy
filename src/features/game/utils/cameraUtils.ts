/**
 * Определяет оптимальный зум камеры в зависимости от разрешения экрана
 * Использует прогрессивную систему зума для разных разрешений
 * @returns Значение зума для камеры
 */
export const getCameraZoom = (): number => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // 4K и выше (3840x2160+) - максимальный зум
  if (width >= 3840 && height >= 2160) {
    return 0.5;
  }

  // 1440p (2560x1440) - высокий зум
  if (width >= 2560 && height >= 1440) {
    return 0.35;
  }

  // 1080p (1920x1080) - средний зум
  if (width >= 1920 && height >= 1080) {
    return 0.25;
  }

  // 900p (1600x900) - низкий зум
  if (width >= 1600 && height >= 900) {
    return 0.2;
  }

  // 768p (1366x768) - очень низкий зум
  if (width >= 1366 && height >= 768) {
    return 0.15;
  }

  // Для остальных разрешений (меньше 768p) - минимальный зум
  return 0.1;
};
