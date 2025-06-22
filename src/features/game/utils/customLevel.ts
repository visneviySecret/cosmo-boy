import { Level, type LevelData } from "../entities/Level";
import { Asteroid } from "../entities/Asteroid";
import { Platform, type PlatformConfig } from "../entities/Platform";
import type Phaser from "phaser";
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
import gameLevelsData from "../../../app/game_levels.json";
import { LEVEL_STORAGE_KEY } from "./editorUtils";
import { isDemoRoute } from "../ui/GameRoot";

const publicGameLevels = gameLevelsData as unknown as LevelData[];

export function loadLevel(savedPlayerLevel: number): Level | null {
  const levels = getLevels();
  const level = levels.find(
    (level: LevelData) => level.id === savedPlayerLevel.toString()
  );
  if (level) {
    return Level.fromJSON(JSON.stringify(level));
  }
  return null;
}

export function getLevels(): LevelData[] {
  // В demo режиме загружаем уровни из localStorage (для редактора)
  // В обычном режиме используем статические уровни из JSON файла
  if (isDemoRoute) {
    const json = localStorage.getItem(LEVEL_STORAGE_KEY);
    const customLevels = JSON.parse(json || "[]");

    return customLevels.length > 0 ? customLevels : publicGameLevels;
  } else {
    return publicGameLevels;
  }
}

export function generateGameObjectsFromLevel(
  scene: Phaser.Scene,
  player: Player,
  level: Level,
  collectedFoodPositions: Array<{ x: number; y: number }> = []
): {
  platforms: PlatformsType[];
  foods: FoodsType[];
  foodGroup: Phaser.Physics.Arcade.Group;
} {
  const platforms: PlatformsType[] = [];
  const foods: FoodsType[] = [];
  const foodGroup = scene.physics.add.group();

  level.getGameObjects().forEach((cfg) => {
    // Проверяем, была ли эта еда уже собрана
    if (isFood(cfg.type)) {
      const isAlreadyCollected = collectedFoodPositions.some(
        (pos) => Math.abs(pos.x - cfg.x) < 10 && Math.abs(pos.y - cfg.y) < 10
      );

      if (isAlreadyCollected) {
        console.log(
          `Пропускаем уже собранную еду на позиции x:${cfg.x}, y:${cfg.y}`
        );
        return; // Не создаем этот объект еды
      }
    }

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
        handleFoodCollision(playerObj, foodObj);
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
