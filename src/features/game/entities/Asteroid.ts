import Phaser from "phaser";
import { calculateGravityForce } from "../utils/gravity";

export interface AsteroidConfig {
  size?: number;
  x: number;
  y: number;
}

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
  private readonly DEFAULT_SIZE = 200;
  private size: number;
  private mass: number;
  private readonly MASS_MULTIPLIER = 5;
  private readonly MIN_DISTANCE = 50;

  constructor(scene: Phaser.Scene, config: AsteroidConfig) {
    super(scene, config.x, config.y, "asteroid");

    this.size = config.size || this.DEFAULT_SIZE;
    this.mass = this.size * this.MASS_MULTIPLIER;

    // Добавляем спрайт в сцену и включаем физику
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Создаем временную графику для астероида
    this.createTemporaryGraphics();

    // Настраиваем физические свойства
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setGravityY(0);

    // Настраиваем размеры коллайдера
    this.setSize(this.size, this.size);
    this.setOffset(0, 0);
  }

  private createTemporaryGraphics() {
    // Создаем временную текстуру для астероида
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xcccccc, 1); // Светло-серый цвет
    graphics.fillCircle(this.size / 2, this.size / 2, this.size / 2);
    graphics.generateTexture("asteroid", this.size, this.size);
    graphics.destroy();

    // Устанавливаем текстуру для спрайта
    this.setTexture("asteroid");
  }

  // Расчет гравитационной силы для объекта
  calculateGravityForce(target: Phaser.Physics.Arcade.Sprite): void {
    if (!target.body?.mass) return;

    const gravityForce = calculateGravityForce(
      this.x,
      this.y,
      this.mass,
      target.x,
      target.y,
      target.body.mass,
      this.MIN_DISTANCE
    );

    // Применяем силу
    if (target.body) {
      target.setVelocity(
        target.body.velocity.x + gravityForce.normalizedDx * gravityForce.force,
        target.body.velocity.y + gravityForce.normalizedDy * gravityForce.force
      );
    }
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
    // Здесь будет логика обновления состояния астероида
  }

  destroy() {
    super.destroy();
  }
}
