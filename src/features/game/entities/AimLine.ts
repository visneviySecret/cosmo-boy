import Phaser from "phaser";
import { Player } from "./Player";
import { AimLineGraphics } from "./AimLineGraphics";

export class AimLine {
  private readonly BASE_LENGTH = 800;
  private readonly MAX_LENGTH = 2000;
  private readonly POWERUP_LENGTH_INCREASE = 200; // Увеличение длины при получении паверапа
  private currentLength: number;
  private targetAsteroid: Phaser.Physics.Arcade.Sprite | null = null;
  private scene: Phaser.Scene;
  private graphics: AimLineGraphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.currentLength = this.BASE_LENGTH;
    this.graphics = new AimLineGraphics(scene);
  }

  setTargetAsteroid(asteroid: Phaser.Physics.Arcade.Sprite | null) {
    if (asteroid) {
      // Получаем игрока из сцены
      const player = this.scene.children.list.find(
        (child) => child instanceof Player
      ) as Player;

      if (player) {
        // Получаем размеры астероида и игрока
        const asteroidSize = (asteroid as any).getSize();
        const playerSize = player.getSize();

        // Вычисляем расстояние между центрами объектов
        const distance = Phaser.Math.Distance.Between(
          player.x,
          player.y,
          asteroid.x,
          asteroid.y
        );

        // Вычитаем половины размеров объектов, чтобы получить расстояние между их поверхностями
        const surfaceDistance = distance - (asteroidSize + playerSize) / 2;

        // Проверяем, что расстояние не отрицательное (объекты не пересекаются)
        const finalDistance = Math.max(0, surfaceDistance);

        if (finalDistance <= this.currentLength) {
          this.targetAsteroid = asteroid;
        } else {
          this.targetAsteroid = null;
        }
      }
    } else {
      this.targetAsteroid = null;
    }
  }

  getTargetAsteroid(): Phaser.Physics.Arcade.Sprite | null {
    return this.targetAsteroid;
  }

  getCurrentLength(): number {
    return this.currentLength;
  }

  increaseAimLine(): void {
    this.currentLength = Math.min(
      this.currentLength + this.POWERUP_LENGTH_INCREASE,
      this.MAX_LENGTH
    );

    const player = this.scene.children.list.find(
      (child) => child instanceof Player
    ) as Player;

    if (player) {
      this.update(player);
    }
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

    this.graphics.update(player.x, player.y, endX, endY, this.targetAsteroid);
  }

  destroy(): void {
    this.graphics.destroy();
  }
}
