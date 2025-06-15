import { Food, type FoodConfig } from "./Food";
import Phaser from "phaser";

export class PurpleTube extends Food {
  private static readonly SPAWN_CHANCE = 0.03; // 10% от 30%

  constructor(scene: Phaser.Scene, config: FoodConfig) {
    super(scene, config);
    this.value = 5; // Дает 5 опыта

    // Создаем временную текстуру для фиолетового тюбика
    this.createTemporaryGraphics();
  }

  public static getSpawnChance(): number {
    return this.SPAWN_CHANCE;
  }

  protected createTemporaryGraphics(): void {
    const graphics = this.scene.add.graphics();

    // Основная часть тюбика (фиолетовый цилиндр)
    graphics.fillStyle(0x800080, 1); // Фиолетовый цвет
    graphics.fillRect(0, 0, this.size, this.size);

    // Верхняя и нижняя части тюбика (более темный фиолетовый)
    graphics.fillStyle(0x4b0082, 1); // Темно-фиолетовый
    graphics.fillRect(0, 0, this.size, this.size / 4); // Верхняя часть
    graphics.fillRect(0, this.size - this.size / 4, this.size, this.size / 4); // Нижняя часть

    // Ободки тюбика (еще более темный)
    graphics.fillStyle(0x2e0854, 1); // Очень темный фиолетовый
    graphics.fillRect(0, this.size / 4 - 1, this.size, 2); // Верхний ободок
    graphics.fillRect(0, this.size - this.size / 4 - 1, this.size, 2); // Нижний ободок

    // Генерируем текстуру
    graphics.generateTexture("purpleTube", this.size, this.size);
    graphics.destroy();

    // Устанавливаем текстуру
    this.setTexture("purpleTube");
    this.setSize(this.size, this.size);
  }
}
