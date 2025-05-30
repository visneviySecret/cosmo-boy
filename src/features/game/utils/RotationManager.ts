import Phaser from "phaser";

export class RotationManager {
  private readonly ROTATION_START_PROGRESS = 0.5;
  private readonly ROTATION_PROGRESS_MULTIPLIER = 2;

  calculateRotationAngle(
    player: Phaser.Physics.Arcade.Sprite,
    asteroid: Phaser.Physics.Arcade.Sprite
  ): number {
    const dx = player.x - asteroid.x;
    const dy = player.y - asteroid.y;
    let angle = Math.atan2(dy, dx);

    // Преобразуем радианы в градусы и добавляем 90 градусов,
    // чтобы нижняя часть игрока была касательной к астероиду
    return Phaser.Math.RadToDeg(angle) + 90;
  }

  updateRotation(
    player: Phaser.Physics.Arcade.Sprite,
    asteroid: Phaser.Physics.Arcade.Sprite,
    jumpProgress: number
  ): void {
    if (jumpProgress >= this.ROTATION_START_PROGRESS) {
      const targetAngle = this.calculateRotationAngle(player, asteroid);
      const startAngle = 0; // Начальный угол (вертикальное положение)
      const rotationProgress =
        (jumpProgress - this.ROTATION_START_PROGRESS) *
        this.ROTATION_PROGRESS_MULTIPLIER;
      const currentAngle =
        startAngle + (targetAngle - startAngle) * rotationProgress;
      player.setRotation(Phaser.Math.DegToRad(currentAngle));
    }
  }

  setFinalRotation(
    player: Phaser.Physics.Arcade.Sprite,
    asteroid: Phaser.Physics.Arcade.Sprite
  ): void {
    const finalAngle = this.calculateRotationAngle(player, asteroid);
    player.setRotation(Phaser.Math.DegToRad(finalAngle));
  }
}
