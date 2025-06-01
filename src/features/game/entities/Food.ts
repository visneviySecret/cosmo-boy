import { Collectible } from "./Collectible";
import Phaser from "phaser";

export abstract class Food extends Collectible {
  protected readonly size: number = 40;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.createTemporaryGraphics();
    this.addPulseAnimation();
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

  // Статический метод для получения шанса появления еды
  public static getSpawnChance(): number {
    throw new Error("Method getSpawnChance() must be implemented");
  }
}
