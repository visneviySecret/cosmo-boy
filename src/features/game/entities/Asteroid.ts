import Phaser from "phaser";
import { Platform } from "./Platform";
import type { PlatformConfig } from "./Platform";

export interface AsteroidConfig extends PlatformConfig {}

export class Asteroid extends Platform {
  constructor(scene: Phaser.Scene, config: AsteroidConfig) {
    super(scene, config);

    this.textureKey = `asteroid_${this.getSize()}_${Math.random().toString(
      16
    )}`;

    // Создаем временную графику для астероида
    this.createTemporaryGraphics();
  }

  private createTemporaryGraphics() {
    // Создаем временную текстуру для астероида
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xcccccc, 1); // Светло-серый цвет
    graphics.fillCircle(
      this.getSize() / 2,
      this.getSize() / 2,
      this.getSize() / 2
    );
    graphics.generateTexture(this.textureKey, this.getSize(), this.getSize());
    graphics.destroy();

    // Устанавливаем текстуру для спрайта
    this.setTexture(this.textureKey);
  }
}
