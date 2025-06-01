import Phaser from "phaser";

export abstract class Collectible extends Phaser.Physics.Arcade.Sprite {
  protected value: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  public getValue(): number {
    return this.value;
  }

  public collect(): void {
    this.destroy();
  }
}
