import { Food, type FoodConfig } from "./Food";
import Phaser from "phaser";
import { playVideo } from "../../../shared/utils/playVideo";

export class Browny extends Food {
  private static readonly SPAWN_CHANCE = 0.05; // 5% шанс появления

  constructor(scene: Phaser.Scene, config: FoodConfig) {
    super(scene, config);
    this.value = -1; // Отрицательное значение для обозначения смертельного предмета
  }

  public static getSpawnChance(): number {
    return this.SPAWN_CHANCE;
  }

  protected createTemporaryGraphics(): void {
    const graphics = this.scene.add.graphics();

    graphics.fillStyle(0x6f4e37, 1);
    graphics.fillRoundedRect(0, 0, this.size, this.size, this.size / 4);
    graphics.fillRect(100, 100, 200, 150);

    graphics.fillStyle(0x3b2f2f, 1);
    const drops = [
      { x: 140, y: 130, r: 10 },
      { x: 200, y: 160, r: 12 },
      { x: 250, y: 180, r: 8 },
      { x: 180, y: 200, r: 9 },
      { x: 230, y: 130, r: 7 },
    ];
    drops.forEach((drop) => {
      graphics.fillCircle(drop.x, drop.y, drop.r);
    });

    graphics.fillStyle(0x8b4513, 1); // Светло-коричневый
    graphics.fillRoundedRect(0, 0, this.size, this.size / 2, this.size / 4);

    graphics.fillStyle(0xffffff, 0.6); // Полупрозрачный белый
    graphics.fillRoundedRect(
      this.size * 0.2,
      this.size * 0.1,
      this.size * 0.3,
      this.size * 0.2,
      this.size / 8
    );

    graphics.generateTexture("browny", this.size, this.size);
    graphics.destroy();

    this.setTexture("browny");
    this.setSize(this.size, this.size);
  }

  public collect(): void {
    this.triggerDeath();
  }

  private triggerDeath(): void {
    this.scene.input.enabled = false;

    playVideo(this.scene, "death", () => {
      this.scene.events.emit("restartLevel");
    });

    this.destroy();
  }
}
