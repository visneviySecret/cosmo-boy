export const LEVEL_STORAGE_KEY = "level";

import type { PlatformConfig } from "../entities/Platform";
import type { FoodConfig } from "../entities/Food";

export type PlatformConfigWithType = PlatformConfig & { type?: string };
export type GameObjectConfigWithType = (PlatformConfig | FoodConfig) & {
  type?: string;
};
