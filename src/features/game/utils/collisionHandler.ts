import { Player } from "../entities/Player";
import { Asteroid } from "../entities/Asteroid";
import Phaser from "phaser";

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
  player.setIsOnMeteorite(true);
}

export function createCollision(
  scene: Phaser.Scene,
  player: Player,
  asteroid: Asteroid
) {
  scene.physics.add.collider(
    player,
    asteroid,
    (obj1: unknown, obj2: unknown) => {
      const playerObj = obj1 as Player;
      const asteroidObj = obj2 as Asteroid;
      handleCollision(playerObj, asteroidObj);
    },
    undefined,
    scene
  );
}
