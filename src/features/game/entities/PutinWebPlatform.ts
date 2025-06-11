import Phaser from "phaser";
import { Platform } from "./Platform";
import type { PlatformConfig } from "./Platform";

export interface PutinWebConfig extends PlatformConfig {
  webDeformation?: number;
  spiderDelay?: number;
  tintLevel?: number;
}

export class PutinWebPlatform extends Platform {
  private webDeformation: number = 0;
  private readonly MAX_DEFORMATION = 20;
  private readonly DEFORMATION_SPEED = 0.5;
  private readonly SPIDER_DELAY = 3000; // 3 секунды до появления паука
  private isPlayerTrapped: boolean = false;
  private spider: Phaser.GameObjects.Sprite | null = null;
  tint: number = 0xffffff;

  constructor(scene: Phaser.Scene, config: PutinWebConfig) {
    super(scene, config);
    this.textureKey = "web-sprite";
    this.setTexture(this.textureKey);
    this.tint = this.getGradientColor(config.tintLevel);
    this.setTintFill(this.tint);
    this.setDisplaySize(this.getSize(), this.getSize());
  }

  update() {
    if (this.isPlayerTrapped) {
      // Анимация деформации паутины
      this.webDeformation += this.DEFORMATION_SPEED;
      if (this.webDeformation > this.MAX_DEFORMATION) {
        this.webDeformation = this.MAX_DEFORMATION;
      }

      // Применяем деформацию к спрайту
      const deformationScale = 1 + Math.sin(this.webDeformation) * 0.1;
      this.setDisplaySize(
        this.getSize() * deformationScale,
        this.getSize() * deformationScale
      );

      // Добавляем тряску игрока
      const player = (this.scene as any).player;
      if (player) {
        player.x += Math.sin(this.webDeformation * 2) * 2;
        player.y += Math.cos(this.webDeformation * 2) * 2;
      }
    }
  }

  onPlayerCollision(player: Phaser.Physics.Arcade.Sprite) {
    if (!this.isPlayerTrapped) {
      this.isPlayerTrapped = true;

      // Останавливаем игрока
      player.setVelocity(0, 0);

      // Запускаем таймер появления паука
      this.scene.time.delayedCall(this.SPIDER_DELAY, () => {
        this.spawnSpider(player);
      });
    }
  }

  private spawnSpider(player: Phaser.Physics.Arcade.Sprite) {
    // Создаем спрайт паука
    this.spider = this.scene.add.sprite(
      this.x - this.getSize() * 2,
      this.y,
      "spider" // Нужно будет добавить текстуру паука в ассеты
    );

    // Анимация появления паука
    this.scene.tweens.add({
      targets: this.spider,
      x: this.x,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        // Анимация поедания игрока
        this.scene.tweens.add({
          targets: player,
          scale: 0,
          duration: 500,
          onComplete: () => {
            // Вызываем событие проигрыша
            this.scene.events.emit("gameOver");
          },
        });
      },
    });
  }

  getGradientColor(t: number | undefined) {
    if (!t) return this.tint;
    t = Math.min(Math.max(t, 0), 1);
    const v = Math.round(255 * (1 - t));
    const hex = v.toString(16).padStart(2, "0");
    console.log(hex);
    return Number(`0x${hex}${hex}${hex}`);
  }
}
