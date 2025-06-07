import Phaser from "phaser";

export interface PlatformConfig {
  x: number;
  y: number;
  size?: number;
  type?: string;
  isEditor?: boolean;
}

export class Platform extends Phaser.Physics.Arcade.Sprite {
  private readonly DEFAULT_SIZE = 200;
  private size: number;
  private mass: number;
  private readonly MASS_MULTIPLIER = 1.4;
  protected graphics: Phaser.GameObjects.Graphics | null = null;
  protected textureKey: string;
  protected outlineRotation: number = 0;
  private isEditor: boolean;

  constructor(scene: Phaser.Scene, config: PlatformConfig) {
    super(scene, config.x, config.y, "platform");

    this.size = config.size || this.DEFAULT_SIZE;
    this.mass = this.size * this.MASS_MULTIPLIER;
    this.textureKey = `platform_${this.size}_${Math.random().toString(16)}`;
    this.isEditor = config.isEditor || false;

    // Добавляем спрайт в сцену и включаем физику
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Настраиваем физические свойства
    this.setCollideWorldBounds(false);
    this.setBounce(0);
    this.setGravityY(0);

    // Настраиваем размеры коллайдера
    this.setSize(this.size, this.size);
    this.setOffset(0, 0);

    // Добавляем базовую интерактивность
    this.setInteractive();
    if (this.input) {
      this.input.enabled = true;
    }

    // Добавляем в список обновляемых объектов
    scene.events.on("update", this.update, this);
  }

  // Получить массу платформы
  getMass(): number {
    return this.mass;
  }

  // Получить размер платформы
  getSize(): number {
    return this.size;
  }

  // Проверяет, находится ли платформа в пределах видимости камеры
  isVisible(): boolean {
    const camera = this.scene.cameras.main;
    const margin = this.getSize() * 2; // Добавляем запас для плавного появления/исчезновения
    return (
      this.x + margin >= camera.scrollX &&
      this.x - margin <= camera.scrollX + camera.width &&
      this.y + margin >= camera.scrollY &&
      this.y - margin <= camera.scrollY + camera.height
    );
  }

  // Базовый метод обновления
  update() {
    // Может быть переопределен в дочерних классах
  }

  // Показать обводку
  protected showOutline() {
    if (this.isEditor) {
      if (!this.graphics) {
        this.graphics = this.scene.add.graphics();
      }
      const outlineRadius = this.getSize() / 2;
      this.graphics.clear();
      this.graphics.lineStyle(4, 0x00ff00, 1);
      this.graphics.strokeCircle(this.x, this.y, outlineRadius);
      return;
    }

    if (!this.graphics) {
      this.graphics = this.scene.add.graphics();
    }
    this.graphics.clear();
    this.graphics.lineStyle(4, 0x00ff00, 1);
    const outlineRadius = this.getSize() / 2 + 10;

    // Рисуем 4 полоски с равными промежутками
    const segments = 4;
    const segmentLength = (Math.PI * 2) / segments;
    const gapLength = segmentLength * 0.2;

    for (let i = 0; i < segments; i++) {
      const startAngle =
        i * segmentLength + gapLength / 2 + this.outlineRotation;
      const endAngle =
        (i + 1) * segmentLength - gapLength / 2 + this.outlineRotation;

      this.graphics.beginPath();
      this.graphics.arc(this.x, this.y, outlineRadius, startAngle, endAngle);
      this.graphics.strokePath();
    }
  }

  // Скрыть обводку
  protected hideOutline() {
    if (this.graphics) {
      this.graphics.clear();
      this.graphics.destroy();
      this.graphics = null;
    }
    this.outlineRotation = 0; // Сбрасываем угол вращения
  }

  destroy() {
    if (this.graphics) {
      this.graphics.destroy();
    }
    if (this.scene && this.scene.events) {
      this.scene.events.off("update", this.update, this);
    }
    super.destroy();
  }
}
