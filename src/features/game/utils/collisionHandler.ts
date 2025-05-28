import { Player } from "../entities/Player";
import { Meteorite } from "../entities/Meteorite";

export function handleCollision(player: Player, meteorite: Meteorite) {
  // Сохраняем скорости перед столкновением
  const playerVelocityX = player.body?.velocity.x || 0;
  const playerVelocityY = player.body?.velocity.y || 0;

  // Вычисляем импульс игрока (p = mv)
  const playerMomentumX = playerVelocityX * player.getMass();
  const playerMomentumY = playerVelocityY * player.getMass();

  // Вычисляем новую скорость метеорита (v = p/m)
  const newVelocityX = playerMomentumX / meteorite.getMass();
  const newVelocityY = playerMomentumY / meteorite.getMass();

  // Устанавливаем одинаковую скорость для метеорита и игрока
  meteorite.setVelocity(newVelocityX, newVelocityY);
  player.setVelocity(newVelocityX, newVelocityY);

  // Устанавливаем флаг нахождения на метеорите
  player.setIsOnMeteorite(true);
}
