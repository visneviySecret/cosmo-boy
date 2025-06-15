import { Level } from "../entities/Level";
import { Asteroid } from "../entities/Asteroid";
import { Platform, type PlatformConfig } from "../entities/Platform";
import type Phaser from "phaser";
import { LEVEL_STORAGE_KEY } from "./editorUtils";
import { EditorItem } from "../../../shared/types/editor";
import { PutinWebPlatform } from "../entities/PutinWebPlatform";
import type { PlatformsType } from "../../../shared/types/platforms";
import type { FoodsType } from "../../../shared/types/food";
import { createCollision } from "./collisionHandler";
import type { Player } from "../entities/Player";
import type { FoodConfig } from "../entities/Food";
import { YellowCan } from "../entities/YellowCan";
import type { GameObjects } from "../../../shared/types/game";
import { PurpleTube } from "../entities/PurpleTube";
import { handleFoodCollision } from "./foodCollisionHandler";

export function loadCustomLevel(): Level | null {
  const json = localStorage.getItem(LEVEL_STORAGE_KEY);
  if (json) {
    return Level.fromJSON(json);
  }
  return null;
}

export function generateGameObjectsFromLevel(
  scene: Phaser.Scene,
  player: Player,
  level: Level
): {
  platforms: PlatformsType[];
  foods: FoodsType[];
  foodGroup: Phaser.Physics.Arcade.Group;
} {
  const platforms: PlatformsType[] = [];
  const foods: FoodsType[] = [];
  const foodGroup = scene.physics.add.group();

  level.getGameObjects().forEach((cfg) => {
    const gameObject = getGameObjectByType(scene, cfg);

    if (isFood(cfg.type)) {
      const food = gameObject as FoodsType;
      foods.push(food);
      foodGroup.add(food);
    } else {
      const platform = gameObject as PlatformsType;
      platforms.push(platform);
      createCollision(scene, player, platform);
    }
  });

  // Создаем коллизию с группой еды
  if (foods.length > 0) {
    scene.physics.add.overlap(
      player,
      foodGroup,
      (obj1: unknown, obj2: unknown) => {
        const playerObj = obj1 as Player;
        const foodObj = obj2 as FoodsType;
        const scoreText = (scene as any).scoreText;
        handleFoodCollision(playerObj, foodObj, scoreText);
      }
    );
  }

  return { platforms, foods, foodGroup };
}

// Оставляем для обратной совместимости
export function generatePlatformsFromLevel(
  scene: Phaser.Scene,
  player: Player,
  level: Level
): PlatformsType[] {
  const { platforms } = generateGameObjectsFromLevel(scene, player, level);
  return platforms;
}

function isFood(type?: string): boolean {
  return type === EditorItem.FOOD_1 || type === EditorItem.FOOD_5;
}

export function getGameObjectByType(
  scene: Phaser.Scene,
  cfg: PlatformConfig | FoodConfig
): GameObjects {
  switch (cfg.type) {
    case EditorItem.ASTEROID:
      return new Asteroid(scene, cfg);
    case EditorItem.PUTIN_WEB:
      return new PutinWebPlatform(scene, cfg);
    case EditorItem.FOOD_1:
      return new YellowCan(scene, cfg);
    case EditorItem.FOOD_5:
      return new PurpleTube(scene, cfg);
    default:
      return new Platform(scene, cfg);
  }
}
