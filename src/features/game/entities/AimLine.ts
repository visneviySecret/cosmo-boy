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
  private targetAsteroid: Phaser.Physics.Arcade.Sprite | null = null;

  constructor(scene: Phaser.Scene) {
    this.graphics = scene.add.graphics();
    this.currentLength = this.BASE_LENGTH;
  }

  setTargetAsteroid(asteroid: Phaser.Physics.Arcade.Sprite | null) {
    this.targetAsteroid = asteroid;
  }

  getTargetAsteroid(): Phaser.Physics.Arcade.Sprite | null {
    return this.targetAsteroid;
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

  update(player: Player): void {
    const pointer = player.scene.input.activePointer;

    // Определяем конечную точку дуги
    let endX: number;
    let endY: number;

    if (this.targetAsteroid) {
      // Если есть целевой астероид, используем его верхушку как конечную точку
      endX = this.targetAsteroid.x;
      endY = this.targetAsteroid.y - (this.targetAsteroid as any).getSize() / 2;
    } else {
      // Иначе используем позицию курсора
      const distance = Phaser.Math.Distance.Between(
        player.x,
        player.y,
        pointer.worldX,
        pointer.worldY
      );

      endX =
        distance > this.currentLength
          ? player.x +
            (pointer.worldX - player.x) * (this.currentLength / distance)
          : pointer.worldX;

      endY =
        distance > this.currentLength
          ? player.y +
            (pointer.worldY - player.y) * (this.currentLength / distance)
          : pointer.worldY;
    }

    this.graphics.clear();

    // Обновляем время анимации
    this.animationTime += this.ANIMATION_SPEED;
    if (this.animationTime > 1) {
      this.animationTime = 0;
    }

    // Рисуем фиксированное количество точек по дуге
    for (let i = 0; i < this.DOT_COUNT; i++) {
      const t = (i / (this.DOT_COUNT - 1) + this.animationTime) % 1;

      const x = player.x + (endX - player.x) * t;
      const y =
        player.y +
        (endY - player.y) * t -
        this.CURVE_HEIGHT * Math.sin(t * Math.PI);

      this.graphics.fillStyle(this.DOT_COLOR, 1);
      this.graphics.fillCircle(x, y, this.DOT_RADIUS);
    }

    // Рисуем зеленую метку
    this.graphics.fillStyle(this.MARKER_COLOR, 1);
    if (this.targetAsteroid) {
      // Если есть целевой астероид, рисуем метку на его верхушке
      this.graphics.fillCircle(
        this.targetAsteroid.x,
        this.targetAsteroid.y - (this.targetAsteroid as any).getSize() / 2,
        this.MARKER_RADIUS
      );
    } else {
      // Иначе рисуем метку в конце линии
      this.graphics.fillCircle(endX, endY, this.MARKER_RADIUS);
    }
  }

  destroy(): void {
    this.graphics.destroy();
  }
}
