import { Player } from "../entities/Player";
import { Asteroid } from "../entities/Asteroid";
import { PutinWebPlatform } from "../entities/PutinWebPlatform";
import Phaser from "phaser";
import type { PlatformsType } from "../../../shared/types/platforms";

export function handleCollision(player: Player, asteroid: Asteroid) {
  // Сохраняем скорости перед столкновением
  const playerVelocityX = player.body?.velocity.x || 0;
  const playerVelocityY = player.body?.velocity.y || 0;

  // Вычисляем импульс игрока (p = mv)
  const playerMomentumX = playerVelocityX * player.getMass();
  const playerMomentumY = playerVelocityY * player.getMass();

  // Вычисляем новую скорость метеорита (v = p/m)
  const newVelocityX = playerMomentumX / asteroid.getMass();
  const newVelocityY = playerMomentumY / asteroid.getMass();

  // Устанавливаем одинаковую скорость для метеорита и игрока
  asteroid.setVelocity(newVelocityX, newVelocityY);
  player.setVelocity(newVelocityX, newVelocityY);

  // Устанавливаем флаг нахождения на метеорите
  player.setIsOnPlatform(true);
}

export function handleWebCollision(player: Player, web: PutinWebPlatform) {
  if (player.isCurrentlyJumping()) {
    return;
  }

  player.setIsOnPlatform(false);
  player.setCurrentWeb(web);
  web.onPlayerCollision(player);
}

export function createCollision(
  scene: Phaser.Scene,
  player: Player,
  platform: PlatformsType
) {
  scene.physics.add.collider(
    player,
    platform,
    (obj1: unknown, obj2: unknown) => {
      const playerObj = obj1 as Player;
      const platformObj = obj2 as PlatformsType;

      if (platformObj instanceof Asteroid) {
        handleCollision(playerObj, platformObj);
      } else if (platformObj instanceof PutinWebPlatform) {
        handleWebCollision(playerObj, platformObj);
      }
    },
    undefined,
    scene
  );
}
