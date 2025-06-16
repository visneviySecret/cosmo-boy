import { playVideo } from "../../../shared/utils/playVideo";
import type { Player } from "../entities/Player";
import type { PutinWebPlatform } from "../entities/PutinWebPlatform";

const SPIDER_SPEED: number = 6000;

export const webBreakAnimation = (
  scene: Phaser.Scene,
  web: PutinWebPlatform
) => {
  scene.tweens.add({
    targets: web,
    alpha: 0.3,
    scaleX: 1.5,
    scaleY: 1.5,
    duration: 300,
    onComplete: () => {
      scene.tweens.add({
        targets: web,
        alpha: 1,
        scaleX: 0.4,
        scaleY: 0.4,
        duration: 200,
      });
    },
  });
};

export const spiderApperAnimation = (
  scene: Phaser.Scene,
  spider: Phaser.GameObjects.Sprite,
  updateSpiderThread: () => void,
  web: PutinWebPlatform,
  player: Player
) => {
  // Создаем анимацию спуска с качанием
  const swingAmplitude = 30; // Амплитуда качания
  const swingFrequency = 2000; // Частота качания в миллисекундах

  let progress = 0;

  // Создаем таймер для качания и обновления ниточки
  const swingTimer = scene.time.addEvent({
    delay: 16, // 60 fps
    callback: () => {
      if (!spider) return;

      progress += 16;
      const swingOffset =
        Math.sin((progress / swingFrequency) * Math.PI * 2) * swingAmplitude;
      spider.x = web.x + swingOffset;

      updateSpiderThread();
    },
    loop: true,
  });

  // Анимация спуска
  scene.tweens.add({
    targets: spider,
    y: web.y,
    duration: SPIDER_SPEED,
    ease: "Power1",
    onComplete: () => {
      // Останавливаем качание
      swingTimer.destroy();

      // Анимация поедания игрока
      if (web.isPlayerTrapped) {
        scene.tweens.add({
          targets: player,
          scale: 0,
          duration: 0,
          onComplete: () => {
            playVideo(scene, "spider-death", () => {
              //   // TODO: перезагрузить сцену
              //   // this.scene.start("GameScene");
            });
          },
        });
      }
    },
  });
};

export const spiderDisappearAnimation = (
  scene: Phaser.Scene,
  spider: Phaser.GameObjects.Sprite | null
) => {
  if (!spider) {
    return;
  }
  scene.tweens.add({
    targets: spider,
    alpha: 0,
    y: spider.y - window.innerHeight,
    duration: SPIDER_SPEED / 4,
    onComplete: () => {
      if (spider) {
        spider.destroy();
        spider = null;
      }
    },
  });
};
