import Phaser from "phaser";
import { Asteroid } from "../entities/Asteroid";
import { AimLine } from "../entities/AimLine";
import { Player } from "../entities/Player";
import { createCollision } from "./collisionHandler";
import { YellowCan } from "../entities/YellowCan";
import { PurpleTube } from "../entities/PurpleTube";

export function generateAsteroids(
  scene: Phaser.Scene,
  aimLine: AimLine,
  player: Player,
  startX: number = 0,
  startY: number = 0
): { asteroids: Asteroid[]; foodGroup: Phaser.Physics.Arcade.Group } {
  const ASTEROID_COUNT = 20;
  const asteroids: Asteroid[] = [];
  const foodGroup = scene.physics.add.group();
  const screenHeight = scene.cameras.main.height;
  const screenWidth = scene.cameras.main.width;
  const FIRST_X_MIN = screenWidth / 4;
  const FIRST_X_MAX = (screenWidth * 3) / 4;
  const FIXED_Y = screenHeight * 0.75;

  // Создаем первый астероид
  const firstX = startX || Phaser.Math.Between(FIRST_X_MIN, FIRST_X_MAX);
  const firstY = startY || FIXED_Y;
  const firstAsteroid = createAsteroid(
    scene,
    firstX,
    firstY,
    player,
    foodGroup
  );
  asteroids.push(firstAsteroid);

  // Создаем остальные астероиды
  for (let i = 1; i < ASTEROID_COUNT; i++) {
    const prevAsteroid = asteroids[i - 1];
    const asteroidSize = randomizeSize(player);
    const maxDistance = aimLine.getCurrentLength() - asteroidSize / 2;
    const minDistance =
      Math.max(prevAsteroid.getSize() + prevAsteroid.getSize()) / 2;
    const distance = Phaser.Math.Between(minDistance, maxDistance);
    const x = prevAsteroid.x + distance;
    const yOffset = Phaser.Math.Between(-minDistance, minDistance);
    const y = FIXED_Y + yOffset;

    const asteroid = createAsteroid(scene, x, y, player, foodGroup);
    asteroids.push(asteroid);
  }

  return { asteroids, foodGroup };
}

function randomizeSize(player: Player): number {
  const minSize = player.getSize();
  const maxSize = player.getSize() * 4;
  return Phaser.Math.Between(minSize, maxSize);
}

function createAsteroid(
  scene: Phaser.Scene,
  x: number,
  y: number,
  player: Player,
  foodGroup: Phaser.Physics.Arcade.Group
): Asteroid {
  const asteroid = new Asteroid(scene, {
    x,
    y,
    size: randomizeSize(player),
  });
  createCollision(scene, player, asteroid);
  tryAddFood(scene, x, y, asteroid.getSize(), foodGroup);
  return asteroid;
}

function tryAddFood(
  scene: Phaser.Scene,
  x: number,
  y: number,
  asteroidSize: number,
  foodGroup: Phaser.Physics.Arcade.Group
): void {
  const random = Math.random();
  const totalChance = YellowCan.getSpawnChance() + PurpleTube.getSpawnChance();

  if (random < totalChance) {
    if (random < PurpleTube.getSpawnChance()) {
      const purpleTube = new PurpleTube(scene, x, y - asteroidSize / 2 - 40);
      foodGroup.add(purpleTube);
    } else {
      const yellowCan = new YellowCan(scene, x, y - asteroidSize / 2 - 40);
      foodGroup.add(yellowCan);
    }
  }
}
