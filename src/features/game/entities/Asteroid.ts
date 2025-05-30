import Phaser from "phaser";

export interface AsteroidConfig {
  size?: number;
  x: number;
  y: number;
}

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
  private readonly DEFAULT_SIZE = 200;
  private size: number;
  private mass: number;
  private readonly MASS_MULTIPLIER = 1.4;
  private graphics: Phaser.GameObjects.Graphics | null = null;
  private outlineRotation: number = 0;
  private readonly ROTATION_SPEED: number = 0.02;
  private textureKey: string;

  constructor(scene: Phaser.Scene, config: AsteroidConfig) {
    super(scene, config.x, config.y, "asteroid");

    this.size = config.size || this.DEFAULT_SIZE;
    this.mass = this.size * this.MASS_MULTIPLIER;
    this.textureKey = `asteroid_${this.size}_${Math.random().toString(16)}`;

    // Добавляем спрайт в сцену и включаем физику
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Добавляем в список обновляемых объектов
    scene.events.on("update", this.update, this);

    // Создаем временную графику для астероида
    this.createTemporaryGraphics();

    // Настраиваем физические свойства
    this.setCollideWorldBounds(false);
    this.setBounce(0);
    this.setGravityY(0);

    // Настраиваем размеры коллайдера
    this.setSize(this.size, this.size);
    this.setOffset(0, 0);

    // Добавляем обработчики событий наведения
    this.setInteractive();
    this.on("pointerover", () => {
      this.showOutline();
      // Получаем ссылку на AimLine из сцены
      const aimLine = (this.scene as any).aimLine;
      if (aimLine) {
        aimLine.setTargetAsteroid(this);
      }
    });
    this.on("pointerout", () => {
      this.hideOutline();
      // Получаем ссылку на AimLine из сцены
      const aimLine = (this.scene as any).aimLine;
      if (aimLine) {
        aimLine.setTargetAsteroid(null);
      }
    });
  }

  private createTemporaryGraphics() {
    // Создаем временную текстуру для астероида
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xcccccc, 1); // Светло-серый цвет
    graphics.fillCircle(this.size / 2, this.size / 2, this.size / 2);
    graphics.generateTexture(this.textureKey, this.size, this.size);
    graphics.destroy();

    // Устанавливаем текстуру для спрайта
    this.setTexture(this.textureKey);
  }

  private showOutline() {
    if (!this.graphics) {
      this.graphics = this.scene.add.graphics();
    }
    this.graphics.clear();
    this.graphics.lineStyle(4, 0x00ff00, 1);
    const outlineRadius = this.size / 2 + 10;

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

  private hideOutline() {
    if (this.graphics) {
      this.graphics.clear();
      this.graphics.destroy();
      this.graphics = null;
    }
    this.outlineRotation = 0; // Сбрасываем угол вращения
  }

  // Получить массу астероида
  getMass(): number {
    return this.mass;
  }

  // Получить размер астероида
  getSize(): number {
    return this.size;
  }

  update() {
    // Обновляем вращение обводки
    if (this.graphics) {
      this.outlineRotation += this.ROTATION_SPEED;
      this.showOutline();
    }
  }

  destroy() {
    if (this.graphics) {
      this.graphics.destroy();
    }
    this.scene.events.off("update", this.update, this);
    super.destroy();
  }

  // Проверяет, находится ли астероид в пределах видимости камеры
  isVisible(): boolean {
    const camera = this.scene.cameras.main;
    const margin = this.size * 2; // Добавляем запас для плавного появления/исчезновения
    return (
      this.x + margin >= camera.scrollX &&
      this.x - margin <= camera.scrollX + camera.width &&
      this.y + margin >= camera.scrollY &&
      this.y - margin <= camera.scrollY + camera.height
    );
  }
}
