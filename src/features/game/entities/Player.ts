import Phaser from "phaser";
import { Meteorite } from "./Meteorite";

export interface PlayerConfig {
  x: number;
  y: number;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly DEFAULT_SIZE = 100;
  private size: number;
  private mass: number;
  private readonly MASS_MULTIPLIER = 1; // Уменьшаем множитель массы для меньшего влияния на столкновения
  private readonly GRAVITY_CONSTANT = 6.6743 * 10; // Уменьшаем константу гравитации для более плавного притяжения
  private readonly MIN_DISTANCE = 50; // Минимальное расстояние для расчета силы

  constructor(scene: Phaser.Scene, config: PlayerConfig) {
    super(scene, config.x, config.y, "player");

    this.size = this.DEFAULT_SIZE;
    this.mass = this.size * this.MASS_MULTIPLIER;

    // Добавляем спрайт в сцену и включаем физику
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Создаем временную графику для игрока
    this.createTemporaryGraphics();

    // Настраиваем физические свойства
    this.setCollideWorldBounds(true);
    this.setBounce(0);

    // Настраиваем размеры коллайдера
    this.setSize(this.size, this.size);
    this.setOffset(0, 0);
  }

  private createTemporaryGraphics() {
    // Создаем временную текстуру для игрока
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x00ff00, 1); // Зеленый цвет для отличия от метеорита
    graphics.fillRect(0, 0, this.size, this.size);
    graphics.generateTexture("player", this.size, this.size);
    graphics.destroy();

    // Устанавливаем текстуру для спрайта
    this.setTexture("player");
  }

  // Получить текущую массу игрока
  getMass(): number {
    return this.mass;
  }

  // Получить текущий размер игрока
  getSize(): number {
    return this.size;
  }

  // Расчет силы притяжения к метеориту
  calculateGravityForce(meteorite: Meteorite): void {
    const dx = meteorite.x - this.x;
    const dy = meteorite.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Используем минимальное расстояние для более равномерного притяжения
    const effectiveDistance = Math.max(distance, this.MIN_DISTANCE);

    // Расчет силы притяжения по закону всемирного тяготения
    const force =
      (this.GRAVITY_CONSTANT * this.mass * meteorite.getMass()) /
      (effectiveDistance * effectiveDistance);

    // Нормализуем вектор направления
    const normalizedDx = dx / distance;
    const normalizedDy = dy / distance;

    // Применяем силу
    if (this.body) {
      this.setVelocity(
        this.body.velocity.x + normalizedDx * force,
        this.body.velocity.y + normalizedDy * force
      );
    }
  }

  // Обновление состояния игрока
  update(meteorite: Meteorite) {
    this.calculateGravityForce(meteorite);
  }

  // Уничтожение игрока
  destroy() {
    super.destroy();
  }
}
