import Phaser from "phaser";
import { Asteroid } from "../entities/Asteroid";

const MAX_LENGTH = 2000; // Максимальная длина линии наводки

export function generateAsteroids(scene: Phaser.Scene): Asteroid[] {
  const ASTEROID_COUNT = 5;
  const asteroids: Asteroid[] = [];
  const screenWidth = scene.cameras.main.width;
  const screenHeight = scene.cameras.main.height;

  // Создаем первый астероид в случайной позиции
  const firstX = Phaser.Math.Between(100, screenWidth - 100);
  const firstY = Phaser.Math.Between(100, screenHeight - 100);
  const firstAsteroid = new Asteroid(scene, { x: firstX, y: firstY });
  asteroids.push(firstAsteroid);

  // Создаем остальные астероиды на расстоянии не более MAX_LENGTH от существующих
  for (let i = 1; i < ASTEROID_COUNT; i++) {
    let validPosition = false;
    let x = 0;
    let y = 0;
    let attempts = 0;
    const MAX_ATTEMPTS = 100;

    while (!validPosition && attempts < MAX_ATTEMPTS) {
      x = Phaser.Math.Between(100, screenWidth - 100);
      y = Phaser.Math.Between(100, screenHeight - 100);

      // Проверяем расстояние до всех существующих астероидов
      validPosition = asteroids.every((asteroid) => {
        const distance = Phaser.Math.Distance.Between(
          x,
          y,
          asteroid.x,
          asteroid.y
        );
        return distance <= MAX_LENGTH;
      });

      attempts++;
    }

    if (validPosition) {
      const asteroid = new Asteroid(scene, { x, y });
      asteroids.push(asteroid);
    }
  }

  return asteroids;
}
