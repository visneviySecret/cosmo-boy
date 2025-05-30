import Phaser from "phaser";
import { ArcCalculator } from "../utils/ArcCalculator";

export interface PlayerConfig {
  x: number;
  y: number;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly DEFAULT_SIZE = 100;
  private size: number;
  private mass: number;
  private readonly MASS_MULTIPLIER = 1;
  private readonly JUMP_FORCE = 700;
  private readonly CURVE_HEIGHT = 200; // Высота дуги, как в AimLine
  private isOnMeteorite: boolean = false;
  private isJumping: boolean = false;
  private jumpStartX: number = 0;
  private jumpStartY: number = 0;
  private jumpTargetX: number = 0;
  private jumpTargetY: number = 0;
  private jumpProgress: number = 0;
  private readonly JUMP_SPEED = 0.02; // Скорость движения по дуге
  private arcCalculator: ArcCalculator;

  constructor(scene: Phaser.Scene, config: PlayerConfig) {
    super(scene, config.x, config.y, "player");

    this.size = this.DEFAULT_SIZE;
    this.mass = this.size * this.MASS_MULTIPLIER;
    this.arcCalculator = new ArcCalculator(this.CURVE_HEIGHT);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.createTemporaryGraphics();

    this.setCollideWorldBounds(true);
    this.setBounce(0);

    this.setSize(this.size, this.size);
    this.setOffset(0, 0);

    scene.input.keyboard?.on("keydown-SPACE", () => {
      this.jump();
    });

    // Добавляем обработчик клика левой кнопкой мыши
    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        this.jumpToAsteroid();
      }
    });

    // Добавляем обработчик обновления для движения по дуге
    scene.events.on("update", this.update, this);
  }

  private createTemporaryGraphics() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x00ff00, 1); // Зеленый цвет для отличия от метеорита
    graphics.fillRect(0, 0, this.size, this.size);
    graphics.generateTexture("player", this.size, this.size);
    graphics.destroy();

    this.setTexture("player");
  }

  private jump(): void {
    if (this.isOnMeteorite && !this.isJumping && this.body) {
      this.isJumping = true;
      // Применяем силу прыжка вверх
      this.setVelocityY(-this.JUMP_FORCE);
    }
  }

  private jumpToAsteroid(): void {
    if (this.isOnMeteorite && !this.isJumping && this.body) {
      const aimLine = (this.scene as any).aimLine;
      if (!aimLine) return;

      const targetAsteroid = aimLine.getTargetAsteroid();
      if (!targetAsteroid) return;

      this.isJumping = true;
      this.isOnMeteorite = false;

      // Сохраняем начальную и конечную точки прыжка
      this.jumpStartX = this.x;
      this.jumpStartY = this.y;
      this.jumpTargetX = targetAsteroid.x;
      // Приземляемся точно на верхушку астероида
      this.jumpTargetY = targetAsteroid.y - targetAsteroid.height / 2;
      this.jumpProgress = 0;

      // Отключаем физику на время прыжка
      this.body.enable = false;
    }
  }

  update(): void {
    if (this.isJumping && !this.isOnMeteorite) {
      // Обновляем прогресс прыжка
      this.jumpProgress += this.JUMP_SPEED;

      // Включаем физику незадолго до столкновения
      if (this.jumpProgress >= 0.8 && this.body && !this.body.enable) {
        this.body.enable = true;
      }

      if (this.jumpProgress >= 1) {
        // Завершаем прыжок
        this.isJumping = false;
        if (this.body) {
          this.body.enable = true;
        }
        return;
      }

      const point = this.arcCalculator.calculateArcPoint(
        this.jumpStartX,
        this.jumpStartY,
        this.jumpTargetX,
        this.jumpTargetY,
        this.jumpProgress
      );

      // Устанавливаем новую позицию
      this.setPosition(point.x, point.y);
    }
  }

  setIsOnMeteorite(value: boolean): void {
    this.isOnMeteorite = value;
    if (value) {
      this.isJumping = false; // Сбрасываем флаг прыжка при приземлении на метеорит
      if (this.body && this.body.enable) {
        this.body.enable = true; // Включаем физику обратно
      }
    }
  }

  getMass(): number {
    return this.mass;
  }

  getSize(): number {
    return this.size;
  }

  destroy() {
    this.scene.events.off("update", this.update, this);
    super.destroy();
  }
}
