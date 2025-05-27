import Phaser from "phaser";

export interface MeteoriteConfig {
  size?: number;
  x: number;
  y: number;
}

export class Meteorite extends Phaser.Physics.Arcade.Sprite {
  private readonly DEFAULT_SIZE = 200;
  private size: number;
  private mass: number;
  private readonly MASS_MULTIPLIER = 2; // Множитель для расчета массы от размера

  constructor(scene: Phaser.Scene, config: MeteoriteConfig) {
    super(scene, config.x, config.y, "meteorite");

    this.size = config.size || this.DEFAULT_SIZE;
    this.mass = this.size * this.MASS_MULTIPLIER;

    // Добавляем спрайт в сцену и включаем физику
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Создаем временную графику для метеорита
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
    // Создаем временную текстуру для метеорита
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xcccccc, 1); // Светло-серый цвет
    graphics.fillCircle(this.size / 2, this.size / 2, this.size / 2);
    graphics.generateTexture("meteorite", this.size, this.size);
    graphics.destroy();

    // Устанавливаем текстуру для спрайта
    this.setTexture("meteorite");
  }

  // Получить массу метеорита
  getMass(): number {
    return this.mass;
  }

  // Получить размер метеорита
  getSize(): number {
    return this.size;
  }

  update() {
    // Здесь будет логика обновления состояния метеорита
  }

  destroy() {
    super.destroy();
  }
}
