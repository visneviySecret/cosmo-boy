import Phaser from "phaser";
import { Platform } from "./Platform";
import type { PlatformConfig } from "./Platform";

export interface AsteroidConfig extends PlatformConfig {}

const textures = ["asteroid_1", "asteroid_2", "asteroid_3"];

function getRandomTexture() {
  return textures[Math.floor(Math.random() * textures.length)];
}

const TEXTURE_SIZE = 240;

export class Asteroid extends Platform {
  constructor(scene: Phaser.Scene, config: AsteroidConfig) {
    super(scene, config, getRandomTexture());
    scene.add.existing(this); // Добавляем спрайт в сцену
    scene.physics.add.existing(this); // Добавляем физику
    if (this.body) {
      // Используем setDisplaySize для лучшего качества текстур при масштабировании
      const displaySize = this.getSize();
      this.setDisplaySize(displaySize, displaySize);

      // Настраиваем физическое тело
      this.body.setCircle(TEXTURE_SIZE / 2);
      this.body.setOffset(0, 0);

      // Делаем астероид неподвижным, чтобы он не двигался при столкновениях
      (this.body as Phaser.Physics.Arcade.Body).immovable = true;
    }
  }
}
