import Phaser from "phaser";
import { ArcCalculator } from "../utils/ArcCalculator";
import { RotationManager } from "../utils/RotationManager";
import { PlayerProgress } from "./PlayerProgress";
import { Food } from "./Food";
import { PutinWebPlatform } from "./PutinWebPlatform";
import type { Asteroid } from "./Asteroid";
import {
  frameSizes,
  getCurrentTexture,
  getOffset,
  textureResize,
  getFrameSize,
} from "../utils/player";
import { growthAnimation, playShakeAnimation } from "../animations/player";
import { saveGame } from "../utils/gameSave";

export interface PlayerConfig {
  x: number;
  y: number;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly DEFAULT_SIZE = 100;
  private size: number;
  private mass: number;
  private readonly MASS_MULTIPLIER = 1;
  private readonly CURVE_HEIGHT = 200; // Высота дуги, как в AimLine
  private isOnPlatform: boolean = false;
  private isJumping: boolean = false;
  private jumpStartX: number = 0;
  private jumpStartY: number = 0;
  private jumpTargetX: number = 0;
  private jumpTargetY: number = 0;
  private jumpProgress: number = 0;
  private readonly INITIAL_JUMP_SPEED = 0.02; // Скорость движения по дуге
  private jumpSpeed: number = this.INITIAL_JUMP_SPEED;
  private readonly JUMP_SPEED_DECREASE = 0.0004;
  private readonly JUMP_SPEED_INCREASE = 0.0005;
  private arcCalculator: ArcCalculator;
  private rotationManager: RotationManager;
  private currentAsteroid: Asteroid | null = null;
  private progress: PlayerProgress;
  private currentWeb: PutinWebPlatform | null = null;
  public hasEscaped: boolean = false;

  // Новые свойства для режима полета на 6 уровне
  private isFlightMode: boolean = false;
  private targetX: number = 0;
  private targetY: number = 0;
  private velocityX: number = 0;
  private velocityY: number = 0;
  private readonly FLIGHT_ACCELERATION = 0.5;
  private readonly FLIGHT_FRICTION = 0.92;
  private readonly MAX_FLIGHT_SPEED = 20;

  constructor(scene: Phaser.Scene, config: PlayerConfig = { x: 0, y: 0 }) {
    super(scene, config.x, config.y, "player");

    const aimLine = (scene as any).aimLine;
    this.progress = new PlayerProgress(aimLine);
    this.size = this.DEFAULT_SIZE * this.progress.getSizeMultiplier();
    this.mass = this.size * this.MASS_MULTIPLIER;
    this.jumpSpeed = this.calculateJumpSpeed(this.progress.getLevel());

    this.arcCalculator = new ArcCalculator(this.CURVE_HEIGHT);
    this.rotationManager = new RotationManager();

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setBounce(0);
    this.updateTexture();
    this.setDepth(200);

    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        if (this.isFlightMode) {
          return;
        }
        this.jumpToPlatform();
      }
    });

    // Обработчик движения мыши для режима полета
    scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isFlightMode) {
        this.targetX = pointer.worldX;
        this.targetY = pointer.worldY;
      }
    });

    scene.events.on("update", this.update, this);
  }

  private updateTexture(): void {
    this.setTexture(getCurrentTexture(this.progress.getLevel()));
    this.setFrame(this.progress.getTextureFrameByExperience());

    // Используем setDisplaySize вместо setScale для лучшего качества
    const frameSize = getFrameSize(this.progress.getLevel());
    this.setDisplaySize(frameSize.frameWidth, frameSize.frameHeight);

    if (this.body) {
      const { width, height } = textureResize(this.progress.getLevel());
      this.body.setSize(width, height);
      this.setOffset(...getOffset(this.progress.getLevel(), width));
    }
  }

  private jumpToPlatform(skipSound: boolean = false): void {
    if (
      this.currentWeb &&
      this.currentWeb.isTrapped() &&
      !this.currentWeb.getEscapeProgress()
    ) {
      this.jumpBlocker();
      return;
    }

    if (
      (this.isOnPlatform || this.currentWeb) &&
      !this.isJumping &&
      this.body
    ) {
      const aimLine = (this.scene as any).aimLine;
      if (!aimLine) return;

      const targetPlatform = aimLine.getTargetPlatform();
      if (!targetPlatform) return;

      if (!skipSound && this.scene && this.scene.sound) {
        this.scene.sound.play("jump_sound", { volume: 0.6 });
      }

      this.isJumping = true;
      this.isOnPlatform = false;

      if (targetPlatform instanceof PutinWebPlatform) {
        this.currentAsteroid = null;
        this.currentWeb = targetPlatform;
        this.jumpTargetY = targetPlatform.y;
        this.hasEscaped = false;
      } else {
        this.currentAsteroid = targetPlatform;
        this.currentWeb = null;
        this.jumpTargetY = targetPlatform.y - targetPlatform.height / 2;
      }

      this.jumpStartX = this.x;
      this.jumpStartY = this.y;
      this.jumpTargetX = targetPlatform.x;
      if (this.jumpTargetX < this.jumpStartX) {
        this.setFlipX(false);
      } else {
        this.setFlipX(true);
      }

      this.jumpProgress = 0;
      // Отключаем физику на время прыжка
      this.body.enable = false;
    }
  }

  private jumpBlocker(): void {
    if (this.currentWeb && this.currentWeb.isTrapped()) {
      const escaped = this.currentWeb.handleEscapeAttempt();
      if (escaped) {
        // Воспроизводим звук прыжка из паутины, если игрок был заперт
        if (this.scene && this.scene.sound) {
          this.scene.sound.play("jump_web_sound", { volume: 0.7 });
        }
        this.hasEscaped = true;
        // Передаем true, чтобы пропустить обычный звук прыжка
        this.jumpToPlatform(true);
      } else {
        playShakeAnimation(this.scene, this);
      }
    }
  }

  update(): void {
    // Проверяем, нужно ли активировать режим полета
    if (this.progress.getLevel() >= 6 && !this.isFlightMode) {
      this.activateFlightMode();
    }

    if (this.isFlightMode) {
      this.updateFlightMovement();
      return;
    }

    if (this.isJumping && !this.isOnPlatform) {
      // Обновляем прогресс прыжка
      this.jumpProgress += this.jumpSpeed;

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
        if (this.currentAsteroid) {
          this.rotationManager.setFinalRotation(this, this.currentAsteroid);
          this.setIsOnPlatform(true);
        }
        if (this.currentWeb) {
          this.setIsOnPlatform(true);
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

      if (this.currentAsteroid) {
        this.rotationManager.updateRotation(
          this,
          this.currentAsteroid,
          this.jumpProgress
        );
      }
    }
  }

  private activateFlightMode(): void {
    this.isFlightMode = true;
    this.isOnPlatform = false;
    this.isJumping = false;

    if (this.body) {
      this.body.enable = true;
      (this.body as Phaser.Physics.Arcade.Body).setGravityY(0);
    }

    this.targetX = this.x;
    this.targetY = this.y;
  }

  private updateFlightMovement(): void {
    if (!this.body) return;

    const deltaX = this.targetX - this.x;
    const deltaY = this.targetY - this.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Уменьшаем зону остановки и добавляем плавное торможение
    const stopDistance = 1;

    if (distance > stopDistance) {
      const dirX = deltaX / distance;
      const dirY = deltaY / distance;

      // Увеличиваем ускорение для дальних целей
      const accelerationMultiplier = Math.min(distance / 100, 2);
      const currentAcceleration =
        this.FLIGHT_ACCELERATION * accelerationMultiplier;

      this.velocityX += dirX * currentAcceleration;
      this.velocityY += dirY * currentAcceleration;

      const currentSpeed = Math.sqrt(
        this.velocityX * this.velocityX + this.velocityY * this.velocityY
      );
      if (currentSpeed > this.MAX_FLIGHT_SPEED) {
        this.velocityX =
          (this.velocityX / currentSpeed) * this.MAX_FLIGHT_SPEED;
        this.velocityY =
          (this.velocityY / currentSpeed) * this.MAX_FLIGHT_SPEED;
      }
    } else {
      // Если близко к цели, применяем сильное торможение
      this.velocityX *= 0.7;
      this.velocityY *= 0.7;
      this.setFlipX(true);

      // Если очень близко и скорость мала, останавливаемся полностью
      if (
        distance < 3 &&
        Math.abs(this.velocityX) < 0.5 &&
        Math.abs(this.velocityY) < 0.5
      ) {
        this.velocityX = 0;
        this.velocityY = 0;
        this.setPosition(this.targetX, this.targetY);
        return;
      }
    }

    // Применяем трение только если не тормозим активно
    if (distance > stopDistance) {
      this.velocityX *= this.FLIGHT_FRICTION;
      this.velocityY *= this.FLIGHT_FRICTION;
    }

    this.setPosition(this.x + this.velocityX, this.y + this.velocityY);

    if (Math.abs(this.velocityX) > 0.1) {
      this.setFlipX(this.velocityX > 0);
    }
  }

  setIsOnPlatform(value: boolean): void {
    this.isOnPlatform = value;
    if (value) {
      this.isJumping = false;
      if (this.body && this.body.enable) {
        this.body.enable = true;
      }
      this.currentAsteroid = null;
    } else {
      this.isJumping = false;
      this.jumpProgress = 0;
      if (this.body) {
        this.body.enable = true;
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
    if (this.scene && this.scene.events) {
      this.scene.events.off("update", this.update, this);
    }
    super.destroy();
  }

  // Проверяет, находится ли игрок в пределах видимости камеры
  isVisible(): boolean {
    const camera = this.scene.cameras.main;
    const margin = this.size * 2;
    return (
      this.x + margin >= camera.scrollX &&
      this.x - margin <= camera.scrollX + camera.width &&
      this.y + margin >= camera.scrollY &&
      this.y - margin <= camera.scrollY + camera.height
    );
  }

  public collectFood(food: Food): void {
    if (food.getValue() === -1) return;

    this.progress.addExperience(food.getValue());
    const isLevelUp = this.progress.handleLevelUp(
      this.playerLvlUpper.bind(this)
    );
    if (!isLevelUp && this.progress.getLevel() <= frameSizes.length) {
      this.decreaseJumpSpeed(food.getValue());
    }
    this.updateTexture();
  }

  private playerLvlUpper(): void {
    this.updateTexture();
    this.jumpSpeed = this.calculateJumpSpeed(this.progress.getLevel());
    growthAnimation(this.scene, this);
    if (this.scene && this.scene.sound) {
      this.scene.sound.play("levelup_sound", { volume: 0.6 });
    }

    this.scene.events.emit("level-up", this.progress.getLevel());

    this.scene.time.addEvent({
      callback: () => {
        if (this) {
          saveGame(this);
        }
      },
    });
  }

  private decreaseJumpSpeed(foodValue: number): void {
    this.jumpSpeed = Math.max(
      this.jumpSpeed -
        this.JUMP_SPEED_DECREASE * this.progress.getLevel() * foodValue,
      this.JUMP_SPEED_DECREASE
    );
  }

  private calculateJumpSpeed(level: number): number {
    if (level === 1) {
      return this.INITIAL_JUMP_SPEED;
    } else {
      const speed =
        this.calculateJumpSpeed(level - 1) +
        Math.pow(this.JUMP_SPEED_INCREASE * 1000, level - 1) / 1000;
      return speed;
    }
  }

  public getLevel(): number {
    return this.progress.getLevel();
  }

  public getExperience(): number {
    return this.progress.getExperience();
  }

  public getCollectedItems(): number {
    return this.progress.getCollectedItems();
  }

  setCurrentWeb(web: PutinWebPlatform | null): void {
    if (this.isCurrentlyJumping()) {
      return;
    }
    this.currentWeb = web;
  }

  isTrappedInWeb(): boolean {
    return this.currentWeb !== null && this.currentWeb.isTrapped();
  }

  isCurrentlyJumping(): boolean {
    return this.isJumping;
  }

  public isInFlightMode(): boolean {
    return this.isFlightMode;
  }

  // Метод для загрузки состояния из сохранения
  public loadFromSave(
    level: number,
    experience: number,
    collectedItems: number,
    x: number,
    y: number
  ): void {
    this.progress.loadFromSave(level, experience, collectedItems);
    this.setPosition(x, y);
    this.size = this.DEFAULT_SIZE * this.progress.getSizeMultiplier();
    this.mass = this.size * this.MASS_MULTIPLIER;
    this.jumpSpeed = this.calculateJumpSpeed(this.progress.getLevel());
    this.updateTexture();

    // Активируем режим полета, если уровень >= 6
    if (this.progress.getLevel() >= 6) {
      this.activateFlightMode();
    }
  }
}
