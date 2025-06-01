import { Food } from "./Food";
import Phaser from "phaser";

export class YellowCan extends Food {
  private static readonly SPAWN_CHANCE = 0.27; // 90% от 30%

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "yellowCan");
    this.value = 1; // Базовое значение для роста
  }

  public static getSpawnChance(): number {
    return this.SPAWN_CHANCE;
  }

  protected createTemporaryGraphics(): void {
    const graphics = this.scene.add.graphics();

    // Основная часть банки (желтый цилиндр)
    graphics.fillStyle(0xffd700, 1); // Золотистый цвет
    graphics.fillRect(0, 0, this.size, this.size);

    // Верхняя и нижняя части банки (более темный желтый)
    graphics.fillStyle(0xdaa520, 1); // Темно-золотистый
    graphics.fillRect(0, 0, this.size, this.size / 4); // Верхняя часть
    graphics.fillRect(0, this.size - this.size / 4, this.size, this.size / 4); // Нижняя часть

    // Ободки банки (еще более темный)
    graphics.fillStyle(0xb8860b, 1); // Темно-золотистый
    graphics.fillRect(0, this.size / 4 - 1, this.size, 2); // Верхний ободок
    graphics.fillRect(0, this.size - this.size / 4 - 1, this.size, 2); // Нижний ободок

    // Генерируем текстуру
    graphics.generateTexture("yellowCan", this.size, this.size);
    graphics.destroy();

    // Устанавливаем текстуру
    this.setTexture("yellowCan");
    this.setSize(this.size, this.size);
  }
}
