export function preloadTextures(this: Phaser.Scene) {
  this.load.image("web-sprite", "assets/web-sprite.svg");
  this.load.image("spider-from-mars", "assets/spider-from-mars.png");
  this.load.image("asteroid_1", "assets/asteroids/asteroid_1.png");
  this.load.image("asteroid_2", "assets/asteroids/asteroid_2.png");
  this.load.image("asteroid_3", "assets/asteroids/asteroid_3.png");
  this.load.spritesheet("player_phase_1", "assets/player/phase_1.png", {
    frameWidth: 276,
    frameHeight: 266,
  });
  this.load.spritesheet("player_phase_2", "assets/player/phase_2.png", {
    frameWidth: 606,
    frameHeight: 606,
  });
}
