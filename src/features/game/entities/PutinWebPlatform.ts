import Phaser from "phaser";
import { Platform } from "./Platform";
import type { PlatformConfig } from "./Platform";
import { Player } from "./Player";
import { playVideo } from "../../../shared/utils/playVideo";

export interface PutinWebConfig extends PlatformConfig {
  webDeformation?: number;
  spiderDelay?: number;
  tintLevel?: number;
}

export class PutinWebPlatform extends Platform {
  private webDeformation: number = 0;
  private readonly MAX_DEFORMATION = 20;
  private readonly DEFORMATION_SPEED = 0.5;
  private isPlayerTrapped: boolean = false;
  private spider: Phaser.GameObjects.Sprite | null = null;
  private spiderThread: Phaser.GameObjects.Graphics | null = null; // Ниточка паука
  private escapeAttempts: number = 1;
  private spiderSpeed: number = 6000;
  private requiredEscapeAttempts: number = 4;
  private readonly BASE_ESCAPE_ATTEMPTS = 1; // Базовое количество прыжков для освобождения
  private readonly MAX_ESCAPE_ATTEMPTS = 4; // Максимальное количество прыжков
  private readonly SIZE_RATIO_MULTIPLIER = 2; // Множитель влияния соотношения размеров
  private lastReleaseTime: number = 0; // Время последнего освобождения
  private readonly IMMUNITY_DURATION = 2000; // 2 секунды иммунитета после освобождения
  tint: number = 0xffffff;

  constructor(scene: Phaser.Scene, config: PutinWebConfig) {
    super(scene, config);
    this.textureKey = "web-sprite";
    this.setTexture(this.textureKey);
    this.tint = this.getGradientColor(config.tintLevel);
    this.setTintFill(this.tint);
    this.setDisplaySize(this.getSize(), this.getSize());
    this.setDepth(90);

    // Инициализируем количество требуемых попыток
    this.requiredEscapeAttempts = this.BASE_ESCAPE_ATTEMPTS;

    // Добавляем обработчики событий наведения
    this.on("pointerover", () => {
      this.showOutline();
      const aimLine = (this.scene as any).aimLine;
      if (aimLine) {
        aimLine.setTargetWeb(this);
      }
    });

    this.on("pointerout", () => {
      this.hideOutline();
      const aimLine = (this.scene as any).aimLine;
      if (aimLine) {
        aimLine.setTargetWeb(null);
      }
    });
  }

  onPlayerCollision(player: Player) {
    if (this.isImmune()) {
      return;
    }

    if (!this.isPlayerTrapped) {
      this.isPlayerTrapped = true;
      this.escapeAttempts = 0;

      // Рассчитываем необходимое количество прыжков на основе соотношения размеров
      const sizeRatio = this.getSize() / player.getSize();
      this.requiredEscapeAttempts = Math.min(
        Math.max(
          this.BASE_ESCAPE_ATTEMPTS,
          Math.floor(
            this.BASE_ESCAPE_ATTEMPTS * sizeRatio * this.SIZE_RATIO_MULTIPLIER
          )
        ),
        this.MAX_ESCAPE_ATTEMPTS
      );

      // Останавливаем игрока
      player.setVelocity(0, 0);

      if (this.isPlayerTrapped) {
        this.spawnSpider(player);
      }
    }
  }

  handleEscapeAttempt(): boolean {
    if (!this.isPlayerTrapped) return false;

    this.escapeAttempts++;
    this.webDeformation += this.DEFORMATION_SPEED * 2; // Увеличиваем деформацию при попытке побега

    // Вычисляем прогресс освобождения
    const escapeProgress = this.escapeAttempts / this.requiredEscapeAttempts;

    // Если достигнуто необходимое количество попыток - освобождаем игрока
    if (this.getEscapeProgress()) {
      this.releasePlayer();
      return true;
    }

    // Добавляем визуальную обратную связь о прогрессе
    this.updateTint(escapeProgress);

    return false;
  }

  private releasePlayer() {
    this.isPlayerTrapped = false;
    this.escapeAttempts = 0;

    // Визуальный эффект разрыва паутины
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          alpha: 1,
          scaleX: 0.4,
          scaleY: 0.4,
          duration: 200,
        });
      },
    });

    // Если паук уже появился, убираем его
    if (this.spider) {
      this.scene.tweens.add({
        targets: this.spider,
        alpha: 0,
        y: this.y - window.innerHeight,
        duration: this.spiderSpeed / 4,
        onComplete: () => {
          if (this.spider) {
            this.spider.destroy();
            this.spider = null;
          }
        },
      });
    }

    // Убираем ниточку
    if (this.spiderThread) {
      this.spiderThread.destroy();
      this.spiderThread = null;
    }

    this.lastReleaseTime = Date.now();
  }

  private updateTint(progress: number) {
    // Меняем цвет паутины от белого к красному по мере освобождения
    const red = 0xff;
    const greenBlue = Math.floor(0xff * (1 - progress));
    this.setTintFill((red << 16) + (greenBlue << 8) + greenBlue);
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

    super.update();
  }

  private updateSpiderThread() {
    if (!this.spiderThread || !this.spider) return;

    this.spiderThread.clear();

    const camera = this.scene.cameras.main;
    const threadStartY = camera.scrollY - 50;
    const threadEndX = this.spider.x;
    const threadEndY = this.spider.y;

    this.spiderThread.lineStyle(2, 0x888888, 0.8);

    const midX = (this.x + threadEndX) / 2;
    const midY = (threadStartY + threadEndY) / 2;
    const curveOffset = Math.sin(Date.now() * 0.002) * 5;

    const path = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(this.x, threadStartY),
      new Phaser.Math.Vector2(midX + curveOffset, midY),
      new Phaser.Math.Vector2(threadEndX, threadEndY)
    );

    path.draw(this.spiderThread, 32);
    this.spiderThread.setDepth(100);
  }

  private spawnSpider(player: Player) {
    if (!this.isPlayerTrapped) return;

    this.spider = this.scene.add.sprite(
      this.x,
      this.y - window.innerHeight,
      "spider-from-mars"
    );

    this.spider.setAngle(180);
    this.spider.setDepth(101);
    this.spiderThread = this.scene.add.graphics();
    this.updateSpiderThread();

    // Создаем анимацию спуска с качанием
    const swingAmplitude = 30; // Амплитуда качания
    const swingFrequency = 2000; // Частота качания в миллисекундах

    let progress = 0;

    // Создаем таймер для качания и обновления ниточки
    const swingTimer = this.scene.time.addEvent({
      delay: 16, // 60 fps
      callback: () => {
        if (!this.spider) return;

        progress += 16;
        const swingOffset =
          Math.sin((progress / swingFrequency) * Math.PI * 2) * swingAmplitude;
        this.spider.x = this.x + swingOffset;

        this.updateSpiderThread();
      },
      loop: true,
    });

    // Анимация спуска
    this.scene.tweens.add({
      targets: this.spider,
      y: this.y,
      duration: this.spiderSpeed,
      ease: "Power1",
      onComplete: () => {
        // Останавливаем качание
        swingTimer.destroy();

        // Анимация поедания игрока
        if (this.isPlayerTrapped) {
          this.scene.tweens.add({
            targets: player,
            scale: 0,
            duration: 0,
            onComplete: () => {
              playVideo(this.scene, "spider-death", () => {
                //   // TODO: перезагрузить сцену
                //   // this.scene.start("GameScene");
              });
            },
          });
        }
      },
    });
  }

  getGradientColor(t: number | undefined) {
    if (!t) return this.tint;
    t = Math.min(Math.max(t, 0), 1);
    const v = Math.round(255 * (1 - t));
    const hex = v.toString(16).padStart(2, "0");
    return Number(`0x${hex}${hex}${hex}`);
  }

  isTrapped(): boolean {
    return this.isPlayerTrapped;
  }

  getEscapeProgress(): boolean {
    if (this.requiredEscapeAttempts === 0) return true;
    return this.escapeAttempts / this.requiredEscapeAttempts > 0.5;
  }

  getEscapeAttempts(): number {
    return this.escapeAttempts;
  }

  getRequiredEscapeAttempts(): number {
    return this.requiredEscapeAttempts;
  }

  isImmune(): boolean {
    const currentTime = Date.now();
    const timeSinceRelease = currentTime - this.lastReleaseTime;
    return timeSinceRelease < this.IMMUNITY_DURATION;
  }
}
