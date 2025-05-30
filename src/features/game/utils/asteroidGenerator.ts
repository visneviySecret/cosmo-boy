import Phaser from "phaser";
import { Asteroid } from "../entities/Asteroid";
import { AimLine } from "../entities/AimLine";
import { Player } from "../entities/Player";

export function generateAsteroids(
  scene: Phaser.Scene,
  aimLine: AimLine
): Asteroid[] {
  const ASTEROID_COUNT = 20;
  const asteroids: Asteroid[] = [];
  const screenHeight = scene.cameras.main.height;
  const screenWidth = scene.cameras.main.width;
  const FIRST_X_MIN = screenWidth / 4;
  const FIRST_X_MAX = (screenWidth * 3) / 4;

  // Получаем игрока из сцены
  const player = scene.children.list.find(
    (child) => child instanceof Player
  ) as Player;
  const PLAYER_SIZE = player ? player.getSize() : 100; // Используем размер существующего игрока или дефолтное значение

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
    // Учитываем размер игрока и его положение на астероиде
    const minDistance = Math.max(
      (prevAsteroidSize + newAsteroidSize) / 2 + PLAYER_SIZE, // Минимальное расстояние с учетом размеров и игрока
      Math.abs(prevAsteroid.y - newAsteroidSize) // Учитываем разницу по высоте
    );

    // Максимальное расстояние с учетом размеров астероидов, игрока и высоты прыжка
    const maxDistance = Math.min(
      aimLine.getCurrentLength() -
        (prevAsteroidSize + newAsteroidSize) / 2 -
        PLAYER_SIZE,
      screenWidth * 0.8 // Ограничиваем максимальное расстояние до 80% ширины экрана
    );

    // Генерируем случайное расстояние в допустимых пределах
    const distance = Phaser.Math.Between(minDistance, maxDistance);

    // Определяем направление с приоритетом вправо (60% шанс)
    const direction = Phaser.Math.Between(0, 100) < 60 ? 1 : -1;

    // Вычисляем новую позицию по X
    const x = prevAsteroid.x + distance * direction;

    // Вычисляем максимально допустимое расстояние по Y с учетом границ экрана
    const maxYDistance = Math.min(
      distance * 0.5, // Максимальное расстояние по Y не более половины расстояния по X
      screenHeight - 100 - prevAsteroid.y, // До нижней границы экрана
      prevAsteroid.y - 100 // До верхней границы экрана
    );

    // Генерируем случайное смещение по Y в пределах допустимого расстояния
    const yOffset = Phaser.Math.Between(-maxYDistance, maxYDistance);
    const y = prevAsteroid.y + yOffset;

    // Создаем новый астероид
    const asteroid = new Asteroid(scene, { x, y });
    asteroids.push(asteroid);
  }

  return asteroids;
}
