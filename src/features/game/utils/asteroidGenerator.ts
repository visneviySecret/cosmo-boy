import Phaser from "phaser";
import { Asteroid } from "../entities/Asteroid";
import { AimLine } from "../entities/AimLine";

export function generateAsteroids(
  scene: Phaser.Scene,
  aimLine: AimLine
): Asteroid[] {
  const ASTEROID_COUNT = 5;
  const asteroids: Asteroid[] = [];
  const screenWidth = scene.cameras.main.width;
  const screenHeight = scene.cameras.main.height;

  // Создаем первый астероид в случайной позиции
  const firstX = Phaser.Math.Between(100, screenWidth - 100);
  const firstY = Phaser.Math.Between(100, screenHeight - 100);
  const firstAsteroid = new Asteroid(scene, { x: firstX, y: firstY });
  asteroids.push(firstAsteroid);

  // Создаем остальные астероиды на расстоянии не более currentLength от существующих
  for (let i = 1; i < ASTEROID_COUNT; i++) {
    let validPosition = false;
    let x = 0;
    let y = 0;
    let tempAsteroid: Asteroid | null = null;

    while (!validPosition) {
      x = Phaser.Math.Between(100, screenWidth - 100);
      y = Phaser.Math.Between(100, screenHeight - 100);

      // Создаем временный астероид для проверки
      tempAsteroid = new Asteroid(scene, { x, y });
      const newAsteroidSize = tempAsteroid.getSize();

      // Проверяем расстояние до всех существующих астероидов
      validPosition = asteroids.every((asteroid) => {
        const distance = Phaser.Math.Distance.Between(
          x,
          y,
          asteroid.x,
          asteroid.y
        );
        // Учитываем размеры астероидов при проверке расстояния
        const asteroidSize = asteroid.getSize();
        const surfaceDistance = distance - (asteroidSize + newAsteroidSize) / 2;
        const finalDistance = Math.max(0, surfaceDistance);

        // Проверяем, что расстояние не меньше половины размера большего астероида
        const minDistance = Math.max(asteroidSize, newAsteroidSize) / 2;

        return (
          finalDistance >= minDistance &&
          finalDistance <= aimLine.getCurrentLength()
        );
      });

      if (validPosition) {
        asteroids.push(tempAsteroid);
      } else {
        tempAsteroid.destroy();
        tempAsteroid = null;
      }
    }
  }

  return asteroids;
}
