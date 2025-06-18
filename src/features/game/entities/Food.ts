import { Collectible } from "./Collectible";
import Phaser from "phaser";

export interface FoodConfig {
  x: number;
  y: number;
  size?: number;
  type?: string;
  texture?: string;
  isEditor?: boolean;
}

export abstract class Food extends Collectible {
  protected readonly size: number = 40;

  constructor(scene: Phaser.Scene, config: FoodConfig) {
    super(scene, config.x, config.y, config.texture || "food");

    // Переопределяем размер для еды
    this.size = config.size || 40;

    // Устанавливаем правильный размер для еды
    this.setSize(this.size, this.size);
    this.setDisplaySize(this.size, this.size);

    this.createTemporaryGraphics();
    this.addPulseAnimation();
    this.type = config.type || "food";
  }

  public getSize(): number {
    return this.size;
  }

  protected abstract createTemporaryGraphics(): void;

  private addPulseAnimation(): void {
    this.scene.tweens.add({
      targets: this,
      scale: { from: 0.8, to: 1.2 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }
}
