import Phaser from "phaser";
import { ArcCalculator } from "../utils/ArcCalculator";
import { RotationManager } from "../utils/RotationManager";
import { PlayerProgress } from "./PlayerProgress";
import { Food } from "./Food";
import { PutinWebPlatform } from "./PutinWebPlatform";
import type { Asteroid } from "./Asteroid";
import {
  calculateTextureScale,
  getCurrentTexture,
  getOffset,
  textureResize,
} from "../utils/player";
import { growthAnimation, playShakeAnimation } from "../animations/player";

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
  private readonly JUMP_SPEED_DECREASE = 0.00025;
  private arcCalculator: ArcCalculator;
  private rotationManager: RotationManager;
  private currentAsteroid: Asteroid | null = null;
  private progress: PlayerProgress;
  private currentWeb: PutinWebPlatform | null = null;
  public hasEscaped: boolean = false;

  constructor(scene: Phaser.Scene, config: PlayerConfig = { x: 0, y: 0 }) {
    super(scene, config.x, config.y, "player");

    const aimLine = (scene as any).aimLine;
    this.progress = new PlayerProgress(aimLine);
    this.size = this.DEFAULT_SIZE * this.progress.getSizeMultiplier();
    this.mass = this.size * this.MASS_MULTIPLIER;

    this.arcCalculator = new ArcCalculator(this.CURVE_HEIGHT);
    this.rotationManager = new RotationManager();

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setBounce(0);
    this.updateTexture();

    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        this.jumpToPlatform();
      }
    });

    scene.events.on("update", this.update, this);
  }

  private updateTexture(): void {
    this.setTexture(getCurrentTexture(this.progress.getLevel()));
    this.setFrame(this.progress.getExperience());
    const textureScale = calculateTextureScale(this.progress.getLevel());
    this.setScale(textureScale);
    if (this.body) {
      const textureSize = textureResize(this.progress.getLevel());
      this.body.setSize(textureSize, textureSize);
      this.setOffset(...getOffset(this.progress.getLevel(), textureSize));
    }
  }

  private jumpToPlatform(): void {
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
        this.hasEscaped = true;
        this.jumpToPlatform();
      } else {
        playShakeAnimation(this.scene, this);
      }
    }
  }

  update(): void {
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

  setIsOnPlatform(value: boolean): void {
    this.isOnPlatform = value;
    if (value) {
      this.isJumping = false;
      if (this.body && this.body.enable) {
        this.body.enable = true;
      }
      // Сбрасываем поворот при отрыве от астероида
      this.currentAsteroid = null;
    } else {
      // Если игрок оторвался от астероида, сбрасываем все связанные состояния
      this.isJumping = false;
      this.jumpProgress = 0;
      this.jumpSpeed = this.INITIAL_JUMP_SPEED;
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
    this.progress.addExperience(food.getValue());
    this.progress.handleLevelUp(this.playerLvlUpper.bind(this));
    this.updateTexture();
  }

  private playerLvlUpper(): void {
    this.updateTexture();
    this.decreaseJumpSpeed();
    growthAnimation(this.scene, this);
  }

  private decreaseJumpSpeed(): void {
    this.jumpSpeed = Math.max(
      this.jumpSpeed - this.JUMP_SPEED_DECREASE,
      this.JUMP_SPEED_DECREASE
    );
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
}
