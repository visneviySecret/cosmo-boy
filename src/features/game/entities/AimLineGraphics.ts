import Phaser from "phaser";
import { ArcCalculator } from "../utils/ArcCalculator";

export class AimLineGraphics {
  private graphics: Phaser.GameObjects.Graphics;
  private readonly MARKER_COLOR = 0x00ff00; // Зеленый цвет
  private readonly MARKER_RADIUS = 15; // Радиус метки
  private readonly DOT_COLOR = 0xffffff;
  private readonly DOT_RADIUS = 5;
  private readonly CURVE_HEIGHT = 200; // Уменьшаем высоту дуги для более пологой формы
  private readonly DOT_COUNT = 50; // Увеличиваем количество точек для более плавной линии
  private readonly ANIMATION_SPEED = 0.001; // Скорость анимации
  private animationTime: number = 0;
  private arcCalculator: ArcCalculator;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.arcCalculator = new ArcCalculator(this.CURVE_HEIGHT);
  }

  update(
    playerX: number,
    playerY: number,
    endX: number,
    endY: number,
    targetAsteroid: Phaser.Physics.Arcade.Sprite | null
  ): void {
    this.graphics.clear();

    // Обновляем время анимации
    this.animationTime += this.ANIMATION_SPEED;
    if (this.animationTime > 1) {
      this.animationTime = 0;
    }

    const points = this.arcCalculator.calculateArcPoints(
      playerX,
      playerY,
      endX,
      endY,
      this.DOT_COUNT
    );

    points.forEach((_, index) => {
      const t = (index / (this.DOT_COUNT - 1) + this.animationTime) % 1;
      const animatedPoint = this.arcCalculator.calculateArcPoint(
        playerX,
        playerY,
        endX,
        endY,
        t
      );

      this.graphics.fillStyle(this.DOT_COLOR, 1);
      this.graphics.fillCircle(
        animatedPoint.x,
        animatedPoint.y,
        this.DOT_RADIUS
      );
    });

    // Рисуем зеленую метку
    this.graphics.fillStyle(this.MARKER_COLOR, 1);
    if (targetAsteroid) {
      // Если есть целевой астероид, рисуем метку на его верхушке
      this.graphics.fillCircle(
        targetAsteroid.x,
        targetAsteroid.y - (targetAsteroid as any).getSize() / 2,
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
