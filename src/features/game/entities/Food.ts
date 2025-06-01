import { Collectible } from "./Collectible";

export class Food extends Collectible {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "food");
    this.value = 10; // Базовое значение для роста

    // Добавляем анимацию пульсации
    scene.tweens.add({
      targets: this,
      scale: { from: 0.8, to: 1.2 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }
}
