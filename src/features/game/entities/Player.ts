import Phaser from "phaser";

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
  private isOnMeteorite: boolean = false;
  private isJumping: boolean = false;

  constructor(scene: Phaser.Scene, config: PlayerConfig) {
    super(scene, config.x, config.y, "player");

    this.size = this.DEFAULT_SIZE;
    this.mass = this.size * this.MASS_MULTIPLIER;

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

  setIsOnMeteorite(value: boolean): void {
    this.isOnMeteorite = value;
    if (value) {
      this.isJumping = false; // Сбрасываем флаг прыжка при приземлении на метеорит
    }
  }

  getMass(): number {
    return this.mass;
  }

  getSize(): number {
    return this.size;
  }

  destroy() {
    super.destroy();
  }
}
