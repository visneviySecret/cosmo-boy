import Phaser from "phaser";
import { Asteroid } from "../entities/Asteroid";
import { AimLine } from "../entities/AimLine";

export function generateAsteroids(
  scene: Phaser.Scene,
  aimLine: AimLine
): Asteroid[] {
  const ASTEROID_COUNT = 5;
  const asteroids: Asteroid[] = [];
  const screenHeight = scene.cameras.main.height;
  const FIRST_X_MIN = 1000;
  const FIRST_X_MAX = 2000;

  // Создаем первый астероид в случайной позиции
  const firstX = Phaser.Math.Between(FIRST_X_MIN, FIRST_X_MAX);
  const firstY = Phaser.Math.Between(100, screenHeight - 100);
  const firstAsteroid = new Asteroid(scene, { x: firstX, y: firstY });
  asteroids.push(firstAsteroid);

  // Создаем остальные астероиды на расстоянии не более currentLength от предыдущего
  for (let i = 1; i < ASTEROID_COUNT; i++) {
    // Получаем предыдущий астероид
    const prevAsteroid = asteroids[i - 1];
    const prevAsteroidSize = prevAsteroid.getSize();

    // Создаем временный астероид для получения его размера
    const tempAsteroid = new Asteroid(scene, { x: 0, y: 0 });
    const newAsteroidSize = tempAsteroid.getSize();
    tempAsteroid.destroy();

    // Генерируем новую позицию на основе предыдущего астероида
    const minDistance = Math.max(prevAsteroidSize, newAsteroidSize) / 2; // Минимальное расстояние - половина размера большего астероида
    const maxDistance =
      aimLine.getCurrentLength() - (prevAsteroidSize + newAsteroidSize) / 2; // Максимальное расстояние с учетом размеров астероидов

    // Генерируем случайное расстояние в допустимых пределах
    const distance = Phaser.Math.Between(minDistance, maxDistance);

    // Определяем направление (влево или вправо)
    const direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;

    // Вычисляем новую позицию
    const x = prevAsteroid.x + distance * direction;
    const y = Phaser.Math.Between(100, screenHeight - 100);

    // Создаем новый астероид
    const asteroid = new Asteroid(scene, { x, y });
    asteroids.push(asteroid);
  }

  return asteroids;
}
