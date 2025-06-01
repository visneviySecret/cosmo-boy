import { Collectible } from "./Collectible";
import Phaser from "phaser";

export class Food extends Collectible {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "food");
    this.value = 1; // Базовое значение для роста

    // Создаем временную текстуру для еды
    this.createTemporaryGraphics();

    // Добавляем анимацию пульсации
    scene.tweens.add({
      targets: this,
      scale: { from: 0.8, to: 1.2 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  private createTemporaryGraphics(): void {
    const graphics = this.scene.add.graphics();
    const size = 40; // Размер банки

    // Основная часть банки (желтый цилиндр)
    graphics.fillStyle(0xffd700, 1); // Золотистый цвет
    graphics.fillRect(0, 0, size, size);

    // Верхняя и нижняя части банки (более темный желтый)
    graphics.fillStyle(0xdaa520, 1); // Темно-золотистый
    graphics.fillRect(0, 0, size, size / 4); // Верхняя часть
    graphics.fillRect(0, size - size / 4, size, size / 4); // Нижняя часть

    // Ободки банки (еще более темный)
    graphics.fillStyle(0xb8860b, 1); // Темно-золотистый
    graphics.fillRect(0, size / 4 - 1, size, 2); // Верхний ободок
    graphics.fillRect(0, size - size / 4 - 1, size, 2); // Нижний ободок

    // Генерируем текстуру
    graphics.generateTexture("food", size, size);
    graphics.destroy();

    // Устанавливаем текстуру
    this.setTexture("food");
    this.setSize(size, size);
  }
}
