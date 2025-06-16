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
  scene.load.spritesheet("player_phase_1", "assets/player/phase_1.png", {
    frameWidth: 276,
    frameHeight: 266,
  });
  scene.load.spritesheet("player_phase_2", "assets/player/phase_2.png", {
    frameWidth: 606,
    frameHeight: 606,
  });
}

function preloadVideos(scene: Phaser.Scene) {
  scene.load.video("spider-death", "assets/player/cosmonaut-spider-death.mp4");
  scene.load.video("growth", "assets/player/cosmonaut-growth.mp4");
  scene.load.video("death", "assets/player/cosmonaut-death.mp4");
}
