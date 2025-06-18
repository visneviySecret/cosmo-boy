import { Level, type LevelData } from "../entities/Level";
import { Asteroid } from "../entities/Asteroid";
import { Platform, type PlatformConfig } from "../entities/Platform";
import type Phaser from "phaser";
import { GAME_LEVELS_STORAGE_KEY } from "./editorUtils";
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
import { Browny } from "../entities/Browny";
import { handleFoodCollision } from "./foodCollisionHandler";

export function loadLevel(savedPlayerLevel: number): Level | null {
  const json = localStorage.getItem(GAME_LEVELS_STORAGE_KEY);
  const levels = JSON.parse(json || "[]");
  const level = levels.find(
    (level: LevelData) => level.id === savedPlayerLevel.toString()
  );
  if (level) {
    return Level.fromJSON(JSON.stringify(level));
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
  return (
    type === EditorItem.FOOD_1 ||
    type === EditorItem.FOOD_5 ||
    type === EditorItem.BROWNY
  );
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
    case EditorItem.BROWNY:
      return new Browny(scene, cfg);
    default:
      return new Platform(scene, cfg);
  }
}
