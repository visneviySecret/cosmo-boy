import { frameSizes } from "./player";

export function preload(this: Phaser.Scene) {
  const scene = this;
  preloadTextures(scene);
  preloadVideos(this);
  preloadSounds(scene);
  preloadMusic(scene);
}

function preloadTextures(scene: Phaser.Scene) {
  scene.load.image("web-sprite", "assets/spider/web-sprite.svg");
  scene.load.image("spider-from-mars", "assets/spider/spider-from-mars.png");
  scene.load.image("asteroid_1", "assets/asteroids/asteroid_1.png");
  scene.load.image("asteroid_2", "assets/asteroids/asteroid_2.png");
  scene.load.image("asteroid_3", "assets/asteroids/asteroid_3.png");

  // Загружаем фоновые изображения
  scene.load.image("bg_space", "assets/backgrounds/space-background.jpg");

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

function preloadSounds(scene: Phaser.Scene) {
  scene.load.audio("eat_sound", "assets/sounds/Eat_1.wav");
  scene.load.audio("jump_sound", "assets/sounds/Jump.wav");
  scene.load.audio("jump_web_sound", "assets/sounds/Jump-web.wav");
  scene.load.audio("levelup_sound", "assets/sounds/Levelup.wav");
  scene.load.audio("Spider_attack", "assets/sounds/Spider-attack.mp3");
}

function preloadMusic(scene: Phaser.Scene) {
  scene.load.audio("level1-2", "assets/music/Cosmic Clarity (level 1-2).mp3");
  scene.load.audio("level3-4", "assets/music/Cosmic Cycles (Level 3-4).mp3");
  scene.load.audio("level5", "assets/music/Whispers in the Web (level 5).mp3");
  scene.load.audio("level6", "assets/music/Cosmic Flight (level 6).mp3");
  scene.load.audio("credits", "assets/music/Cosmic Wings (credits).mp3");
}

function preloadVideos(scene: Phaser.Scene) {
  scene.load.video("spider-death", "assets/player/cosmonaut-spider-death.mp4");
  scene.load.video("growth", "assets/player/cosmonaut-growth.mp4");
  scene.load.video("death", "assets/player/cosmonaut-death.mp4");
  scene.load.video("cosmonaut-end", "assets/player/cosmonaut-end.mp4");
}
