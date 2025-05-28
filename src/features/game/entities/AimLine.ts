import Phaser from "phaser";
import { Player } from "./Player";

export class AimLine {
  private graphics: Phaser.GameObjects.Graphics;
  private readonly BASE_LENGTH = 800;
  private readonly MAX_LENGTH = 2000;
  private readonly POWERUP_LENGTH_INCREASE = 200; // Увеличение длины при получении паверапа
  private readonly MARKER_COLOR = 0x00ff00; // Зеленый цвет
  private readonly MARKER_RADIUS = 15; // Радиус метки
  private readonly DOT_COLOR = 0xffffff;
  private readonly DOT_RADIUS = 5;
  private readonly CURVE_HEIGHT = 200; // Уменьшаем высоту дуги для более пологой формы
  private readonly DOT_COUNT = 50; // Увеличиваем количество точек для более плавной линии
  private readonly ANIMATION_SPEED = 0.001; // Скорость анимации
  private currentLength: number;
  private animationTime: number = 0;

  constructor(scene: Phaser.Scene) {
    this.graphics = scene.add.graphics();
    this.currentLength = this.BASE_LENGTH;
  }

  addPowerup(): void {
    this.currentLength = Math.min(
      this.currentLength + this.POWERUP_LENGTH_INCREASE,
      this.MAX_LENGTH
    );
  }

  reset(): void {
    this.currentLength = this.BASE_LENGTH;
  }

  private smoothStep(x: number): number {
    // Функция плавного перехода
    return x * x * (3 - 2 * x);
  }

  update(player: Player): void {
    const pointer = player.scene.input.activePointer;

    const distance = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      pointer.worldX,
      pointer.worldY
    );

    const endX =
      distance > this.currentLength
        ? player.x +
        (pointer.worldX - player.x) * (this.currentLength / distance)
        : pointer.worldX;

    const endY =
      distance > this.currentLength
        ? player.y +
        (pointer.worldY - player.y) * (this.currentLength / distance)
        : pointer.worldY;

    this.graphics.clear();

    // Обновляем время анимации
    this.animationTime += this.ANIMATION_SPEED;
    if (this.animationTime > 1) {
      this.animationTime = 0;
    }

    // Вычисляем высоту дуги с плавным переходом
    const dx = Math.abs(pointer.worldX - player.x);
    const rawHeightFactor = Math.min(1, dx / this.CURVE_HEIGHT);
    const heightFactor = this.smoothStep(rawHeightFactor);
    const currentCurveHeight = this.CURVE_HEIGHT * heightFactor;

    // Рисуем фиксированное количество точек по дуге
    for (let i = 0; i < this.DOT_COUNT; i++) {
      // Добавляем смещение по времени к позиции точки
      const t = (i / (this.DOT_COUNT - 1) + this.animationTime) % 1;

      // Вычисляем позицию точки на полукруге
      const x = player.x + (endX - player.x) * t;
      const y = player.y + (endY - player.y) * t - this.CURVE_HEIGHT * Math.sin(t * Math.PI);

      this.graphics.fillStyle(this.DOT_COLOR, 1);
      this.graphics.fillCircle(x, y, this.DOT_RADIUS);
    }

    // Рисуем зеленую метку
    this.graphics.fillStyle(this.MARKER_COLOR, 1);
    this.graphics.fillCircle(endX, endY, this.MARKER_RADIUS);
  }

  destroy(): void {
    this.graphics.destroy();
  }
}
