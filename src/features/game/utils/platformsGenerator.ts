import Phaser from "phaser";
import { Asteroid } from "../entities/Asteroid";
import { AimLine } from "../entities/AimLine";
import { Player } from "../entities/Player";
import { createCollision } from "./collisionHandler";
import { YellowCan } from "../entities/YellowCan";
import { PurpleTube } from "../entities/PurpleTube";
import { PutinWebPlatform } from "../entities/PutinWebPlatform";

export function generatePlatforms(
  scene: Phaser.Scene,
  aimLine: AimLine,
  player: Player,
  startX: number = 0,
  startY: number = 0
): { asteroids: Asteroid[]; foodGroup: Phaser.Physics.Arcade.Group } {
  const PLATFORMS_COUNT = 60; // Увеличиваем количество объектов
  const asteroids: Asteroid[] = [];
  const foodGroup = scene.physics.add.group();
  const screenHeight = scene.cameras.main.height;

  const maxDistance = (aimLine.getCurrentLength() - player.getSize()) / 5;
  const minDistance = maxDistance / 15; // Уменьшаем минимальное расстояние для более частой генерации

  const MIN_Y = screenHeight * 0.01;
  const MAX_Y = screenHeight * 0.9;

  let currentX = startX || player.x + minDistance;

  const WEB_SPAWN_CHANCE = 0; // Отключаем появление паутин

  for (let i = 0; i < PLATFORMS_COUNT; i++) {
    let attempts = 0;
    let validPosition = false;
    let objectX: number = currentX;
    let objectY: number = startY || Phaser.Math.Between(MIN_Y, MAX_Y);
    let objectSize: number = randomizeSize(player);
    let isWeb: boolean = Math.random() < WEB_SPAWN_CHANCE;

    while (!validPosition && attempts < 100) {
      objectSize = randomizeSize(player);
      isWeb = Math.random() < WEB_SPAWN_CHANCE;

      if (i === 0) {
        objectX = currentX;
        objectY = startY || Phaser.Math.Between(MIN_Y, MAX_Y);
      } else {
        const prevObject = asteroids[i - 1];

        const maxDistanceFromPrev =
          maxDistance - (prevObject.getSize() + objectSize) / 2;
        const minDistanceFromPrev =
          minDistance + (prevObject.getSize() + objectSize) / 2;

        const distance = Phaser.Math.Between(
          Math.max(minDistanceFromPrev, minDistance),
          Math.min(maxDistanceFromPrev, maxDistance * 0.8)
        );

        const layerCount = Math.floor(Math.random() * 3) + 1;
        const layerIndex = i % layerCount;
        const layerHeight = (MAX_Y - MIN_Y) / layerCount;
        const layerY = MIN_Y + layerIndex * layerHeight + layerHeight / 2;

        const angle = Phaser.Math.Between(-90, 90);
        const angleRad = Phaser.Math.DegToRad(angle);

        objectX = prevObject.x + Math.cos(angleRad) * distance;
        objectY = layerY + Math.sin(angleRad) * distance * 0.3;

        const safeMargin = objectSize / 2;
        objectY = Math.max(
          MIN_Y + safeMargin,
          Math.min(MAX_Y - safeMargin, objectY)
        );

        if (objectX <= prevObject.x + minDistanceFromPrev) {
          objectX = prevObject.x + minDistanceFromPrev;
        }

        const randomOffsetX = Phaser.Math.Between(
          -minDistance / 3,
          minDistance / 3
        );
        const randomOffsetY = Phaser.Math.Between(
          -layerHeight / 4,
          layerHeight / 4
        );
        objectX += randomOffsetX;
        objectY += randomOffsetY;

        objectY = Math.max(
          MIN_Y + safeMargin,
          Math.min(MAX_Y - safeMargin, objectY)
        );
      }

      validPosition =
        isWeb ||
        !checkCollisionWithExistingAsteroids(
          asteroids,
          objectX,
          objectY,
          objectSize
        );

      if (validPosition && i > 0) {
        const prevObject = asteroids[i - 1];
        const distanceFromPrev = Phaser.Math.Distance.Between(
          prevObject.x,
          prevObject.y,
          objectX,
          objectY
        );

        const surfaceDistance =
          distanceFromPrev - (prevObject.getSize() + objectSize) / 2;
        if (surfaceDistance > maxDistance) {
          validPosition = false;
        }
      }

      attempts++;

      if (!validPosition && attempts >= 50) {
        if (i > 0) {
          const prevObject = asteroids[i - 1];
          objectX =
            prevObject.x +
            minDistance +
            (prevObject.getSize() + objectSize) / 2;
          objectY = Phaser.Math.Between(
            MIN_Y + objectSize / 2,
            MAX_Y - objectSize / 2
          );
        }
      }
    }

    let gameObject: Asteroid;
    if (isWeb) {
      gameObject = createWeb(
        scene,
        objectX,
        objectY,
        objectSize,
        player,
        foodGroup
      );
    } else {
      gameObject = createAsteroid(
        scene,
        objectX,
        objectY,
        objectSize,
        player,
        foodGroup
      );
    }

    asteroids.push(gameObject);

    currentX = objectX + minDistance / 2;
  }

  return { asteroids, foodGroup };
}

function checkCollisionWithExistingAsteroids(
  existingAsteroids: Asteroid[],
  newX: number,
  newY: number,
  newSize: number
): boolean {
  for (const asteroid of existingAsteroids) {
    const distance = Phaser.Math.Distance.Between(
      asteroid.x,
      asteroid.y,
      newX,
      newY
    );

    const minDistanceBetweenCenters = (asteroid.getSize() + newSize) / 2 + 15;

    if (distance < minDistanceBetweenCenters) {
      return true;
    }
  }

  return false;
}

function randomizeSize(player: Player): number {
  const minSize = player.getSize() * 0.8;
  const maxSize = player.getSize() * 5;
  return Phaser.Math.Between(minSize, maxSize);
}

function createAsteroid(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  player: Player,
  foodGroup: Phaser.Physics.Arcade.Group
): Asteroid {
  const asteroid = new Asteroid(scene, {
    x,
    y,
    size,
  });
  createCollision(scene, player, asteroid);
  tryAddFood(scene, x, y, asteroid.getSize(), foodGroup);
  return asteroid;
}

function createWeb(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  player: Player,
  foodGroup: Phaser.Physics.Arcade.Group
): Asteroid {
  const web = new PutinWebPlatform(scene, {
    x,
    y,
    size: size,
    tintLevel: Math.random(),
  });
  createCollision(scene, player, web);
  tryAddFood(scene, x, y, web.getSize(), foodGroup);

  return web as any as Asteroid;
}

function tryAddFood(
  scene: Phaser.Scene,
  x: number,
  y: number,
  asteroidSize: number,
  foodGroup: Phaser.Physics.Arcade.Group
): void {
  const random = Math.random();
  const totalChance =
    (YellowCan.getSpawnChance() + PurpleTube.getSpawnChance()) * 1.5; // Увеличиваем шанс появления еды

  if (random < totalChance) {
    const config = {
      x,
      y: y - asteroidSize / 2 - 40,
    };
    if (random < PurpleTube.getSpawnChance() * 1.5) {
      const purpleTube = new PurpleTube(scene, config);
      foodGroup.add(purpleTube);
    } else {
      const yellowCan = new YellowCan(scene, config);
      foodGroup.add(yellowCan);
    }
  }
}
