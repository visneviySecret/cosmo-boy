export const LEVEL_STORAGE_KEY = "level";

export const GAME_LEVELS_STORAGE_KEY = "game_levels";

import type { PlatformConfig } from "../entities/Platform";
import type { FoodConfig } from "../entities/Food";

export type PlatformConfigWithType = PlatformConfig & { type?: string };
export type GameObjectConfigWithType = (PlatformConfig | FoodConfig) & {
  type?: string;
};
