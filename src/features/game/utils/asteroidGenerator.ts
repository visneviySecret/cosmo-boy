import Phaser from "phaser";
import { Asteroid } from "../entities/Asteroid";
import { AimLine } from "../entities/AimLine";
import { Player } from "../entities/Player";
import { createCollision } from "./collisionHandler";

export function generateAsteroids(
  scene: Phaser.Scene,
  aimLine: AimLine,
  player: Player,
  startX: number = 0,
  startY: number = 0
): Asteroid[] {
  const ASTEROID_COUNT = 20;
  const asteroids: Asteroid[] = [];
  const screenHeight = scene.cameras.main.height;
  const screenWidth = scene.cameras.main.width;
  const FIRST_X_MIN = screenWidth / 4;
  const FIRST_X_MAX = (screenWidth * 3) / 4;
  const FIXED_Y = screenHeight * 0.75; // Фиксированная высота для всех астероидов

  // Создаем первый астероид в указанной позиции или случайной
  const firstX = startX || Phaser.Math.Between(FIRST_X_MIN, FIRST_X_MAX);
  const firstY = startY || FIXED_Y;
  const firstAsteroid = new Asteroid(scene, { x: firstX, y: firstY });
  createCollision(scene, player, firstAsteroid, aimLine);
  asteroids.push(firstAsteroid);

  // Создаем остальные астероиды на расстоянии не более currentLength от предыдущего
  for (let i = 1; i < ASTEROID_COUNT; i++) {
    const prevAsteroid = asteroids[i - 1];

    const maxDistance = aimLine.getCurrentLength();
    const minDistance =
      Math.max(prevAsteroid.getSize() + prevAsteroid.getSize()) / 2;
    const distance = Phaser.Math.Between(minDistance, maxDistance);
    const x = prevAsteroid.x + distance;
    const yOffset = Phaser.Math.Between(-minDistance, minDistance);
    const y = FIXED_Y + yOffset;

    const asteroid = new Asteroid(scene, { x, y });
    createCollision(scene, player, asteroid, aimLine);
    asteroids.push(asteroid);
  }

  return asteroids;
}
