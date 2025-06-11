export const LEVEL_STORAGE_KEY = "custom_level";

export const GAME_LEVELS_STORAGE_KEY = "game_levels";

import type { PlatformConfig } from "../entities/Platform";

export type PlatformConfigWithType = PlatformConfig & { type?: string };
