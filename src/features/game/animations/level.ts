import { playVideo } from "../../../shared/utils/playVideo";

export const levelWhiteGlow = (scene: Phaser.Scene, onComplete: () => void) => {
  const whiteGlow = scene.add.graphics();
  whiteGlow.setDepth(1000);

  // Анимация усиления свечения
  let glowIntensity = 0;
  const glowTimer = scene.time.addEvent({
    delay: 50,
    callback: () => {
      glowIntensity += 0.02;
      whiteGlow.clear();

      // Создаем градиентное свечение на весь экран
      const camera = scene.cameras.main;

      // Учитываем масштаб камеры (zoom 0.5 означает что камера отдалена в 2 раза)
      const zoom = camera.zoom;
      const actualWidth = camera.width / zoom;
      const actualHeight = camera.height / zoom;

      // Позиция с учетом скролла и масштаба
      const startX = camera.scrollX;
      const startY = camera.scrollY;

      whiteGlow.fillGradientStyle(
        0xffffff,
        0xffffff,
        0xffffff,
        0xffffff,
        0,
        glowIntensity,
        glowIntensity,
        0
      );

      // Заполняем весь видимый экран
      whiteGlow.fillRect(
        startX - actualWidth / 4,
        startY - actualHeight / 4,
        actualWidth,
        actualHeight
      );

      // Когда свечение достигает максимума, запускаем видео
      if (glowIntensity >= 1) {
        glowTimer.destroy();
        playVideo(scene, "cosmonaut-end", () => {
          // После видео показываем титры
          whiteGlow.destroy();
          onComplete();
        });
      }
    },
    loop: true,
  });
};
