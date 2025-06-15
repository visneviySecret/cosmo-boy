import Phaser from "phaser";

export abstract class Collectible extends Phaser.Physics.Arcade.Sprite {
  protected value: number = 0;
  private DEFAULT_COLLECTIBLE_SIZE: number = 10;
  protected size: number = this.DEFAULT_COLLECTIBLE_SIZE;

  constructor(scene: Phaser.Scene, x: number, y: number, texture?: string) {
    super(scene, x, y, texture || "collectible");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.size = this.DEFAULT_COLLECTIBLE_SIZE;
  }

  public getValue(): number {
    return this.value;
  }

  public getSize(): number {
    return this.size;
  }

  public collect(): void {
    this.destroy();
  }

  // TODO: вынести в GameObject
  isVisible(): boolean {
    if (!this.scene || !this.scene.cameras || !this.scene.cameras.main) {
      return false;
    }

    const camera = this.scene.cameras.main;
    const margin = this.getSize() * 2; // Добавляем запас для плавного появления/исчезновения
    return (
      this.x + margin >= camera.scrollX &&
      this.x - margin <= camera.scrollX + camera.width &&
      this.y + margin >= camera.scrollY &&
      this.y - margin <= camera.scrollY + camera.height
    );
  }
}
