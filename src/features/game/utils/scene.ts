import { frameSizes } from "./player";

export function preload(this: Phaser.Scene) {
  const scene = this;
  preloadTextures(scene);
  preloadVideos(this);
}

function preloadTextures(scene: Phaser.Scene) {
  scene.load.image("web-sprite", "assets/spider/web-sprite.svg");
  scene.load.image("spider-from-mars", "assets/spider/spider-from-mars.png");
  scene.load.image("asteroid_1", "assets/asteroids/asteroid_1.png");
  scene.load.image("asteroid_2", "assets/asteroids/asteroid_2.png");
  scene.load.image("asteroid_3", "assets/asteroids/asteroid_3.png");

  // Загружаем фоновые изображения
  scene.load.image("bg_level_1", "assets/backgrounds/level 1.png");
  scene.load.image("bg_level_2", "assets/backgrounds/level 2.png");
  scene.load.image("bg_level_3", "assets/backgrounds/level 3.png");
  scene.load.image("bg_level_4", "assets/backgrounds/level 4.png");
  scene.load.image("bg_level_5", "assets/backgrounds/level 5.png");
  scene.load.image("bg_level_6", "assets/backgrounds/level 6.png");
  scene.load.image("bg_level_7", "assets/backgrounds/level 7.png");
  scene.load.image("bg_level_8", "assets/backgrounds/level 8.png");

  preloadPlayerTextures(scene);
}

function preloadPlayerTextures(scene: Phaser.Scene) {
  frameSizes.forEach((frameSize, index) => {
    scene.load.spritesheet(
      `player_phase_${index + 1}`,
      `assets/player/phase_${index + 1}.png`,
      frameSize
    );
  });
}

function preloadVideos(scene: Phaser.Scene) {
  scene.load.video("spider-death", "assets/player/cosmonaut-spider-death.mp4");
  scene.load.video("growth", "assets/player/cosmonaut-growth.mp4");
  scene.load.video("death", "assets/player/cosmonaut-death.mp4");
  scene.load.video("cosmonaut-end", "assets/player/cosmonaut-end.mp4");
}
