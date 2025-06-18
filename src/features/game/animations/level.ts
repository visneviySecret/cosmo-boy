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

      // Создаем градиентное свечение
      const camera = scene.cameras.main;
      const glowWidth = Math.min(camera.width * glowIntensity, camera.width);
      const glowX = camera.scrollX + camera.width - glowWidth;

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
      whiteGlow.fillRect(glowX, camera.scrollY, glowWidth, camera.height);

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
