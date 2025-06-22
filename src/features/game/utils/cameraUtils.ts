/**
 * Определяет оптимальный зум камеры в зависимости от разрешения экрана
 * @returns Значение зума для камеры
 */
export const getCameraZoom = (): number => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Для Full HD (1920x1080) и меньших разрешений используем меньший зум
  if (width <= 1920 && height <= 1080) {
    return 0.3;
  }

  // Для больших разрешений используем стандартный зум
  return 0.5;
};
