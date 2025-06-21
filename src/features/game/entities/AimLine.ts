import Phaser from "phaser";
import { Player } from "./Player";
import { AimLineGraphics } from "./AimLineGraphics";
import { PutinWebPlatform } from "./PutinWebPlatform";
import { Platform } from "./Platform";

export class AimLine {
  private readonly BASE_LENGTH = 800;
  private readonly MAX_LENGTH = 2000;
  private readonly LEVEL_LENGTH_INCREASE = 100; // Увеличение длины при получении паверапа
  private currentLength: number;
  private targetPlatform: Platform | Phaser.Physics.Arcade.Sprite | null = null;
  private scene: Phaser.Scene;
  private graphics: AimLineGraphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.currentLength = this.BASE_LENGTH;
    this.graphics = new AimLineGraphics(scene);
  }

  setTargetPlatform(platform: Platform | Phaser.Physics.Arcade.Sprite | null) {
    if (platform) {
      const player = this.scene.children.list.find(
        (child) => child instanceof Player
      ) as Player;

      if (player) {
        const platformSize = (platform as any).getSize();
        const playerSize = player.getSize();

        const distance = Phaser.Math.Distance.Between(
          player.x,
          player.y,
          platform.x,
          platform.y
        );

        const surfaceDistance = distance - (platformSize + playerSize) / 2;
        const finalDistance = Math.max(0, surfaceDistance);

        if (finalDistance <= this.currentLength) {
          this.targetPlatform = platform;
        } else {
          this.targetPlatform = null;
        }
      }
    } else {
      this.targetPlatform = null;
    }
  }

  // Устаревший метод, оставлен для обратной совместимости
  setTargetAsteroid(asteroid: Phaser.Physics.Arcade.Sprite | null) {
    this.setTargetPlatform(asteroid);
  }

  // Устаревший метод, оставлен для обратной совместимости
  setTargetWeb(web: PutinWebPlatform | null) {
    this.setTargetPlatform(web);
  }

  getTargetPlatform(): Platform | Phaser.Physics.Arcade.Sprite | null {
    return this.targetPlatform;
  }

  // Устаревший метод, оставлен для обратной совместимости
  getTargetAsteroid(): Phaser.Physics.Arcade.Sprite | null {
    return this.targetPlatform instanceof Phaser.Physics.Arcade.Sprite
      ? this.targetPlatform
      : null;
  }

  // Устаревший метод, оставлен для обратной совместимости
  getTargetWeb(): PutinWebPlatform | null {
    return this.targetPlatform instanceof PutinWebPlatform
      ? this.targetPlatform
      : null;
  }

  getCurrentLength(): number {
    return this.currentLength;
  }

  increaseAimLine(): void {
    const player = this.scene.children.list.find(
      (child) => child instanceof Player
    ) as Player;
    this.increaseAimLineByLevel(player.getLevel());
    if (player) {
      this.update(player);
    }
  }

  increaseAimLineByLevel(level: number): void {
    this.currentLength = this.aimlineIncreaser(level);
  }

  aimlineIncreaser(level: number): number {
    if (level === 1) {
      return this.BASE_LENGTH;
    } else {
      return (
        this.aimlineIncreaser(level - 1) +
        this.LEVEL_LENGTH_INCREASE * (level - 1)
      );
    }
  }

  update(player: Player): void {
    // Не показываем AimLine в режиме полета
    if (player.isInFlightMode()) {
      this.graphics.hide();
      return;
    }

    const pointer = player.scene.input.activePointer;

    let endX: number;
    let endY: number;

    if (this.targetPlatform) {
      if (this.targetPlatform instanceof PutinWebPlatform) {
        // Если цель - паутина, используем её центр
        endX = this.targetPlatform.x;
        endY = this.targetPlatform.y;
      } else {
        // Если цель - астероид или другая платформа, используем верхушку
        endX = this.targetPlatform.x;
        endY =
          this.targetPlatform.y - (this.targetPlatform as any).getSize() / 2;
      }
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

    this.graphics.update(player.x, player.y, endX, endY, this.targetPlatform);
  }

  destroy(): void {
    this.graphics.destroy();
  }
}
