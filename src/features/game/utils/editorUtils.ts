import Phaser from "phaser";
import { Platform } from "../entities/Platform";
import { Asteroid } from "../entities/Asteroid";
import { EditorItem } from "../../../shared/types/editor";

export const LEVEL_STORAGE_KEY = "custom_level";

import type { PlatformConfig } from "../entities/Platform";

export type PlatformConfigWithType = PlatformConfig & { type?: string };

export interface EditorConfig {
  x: number;
  y: number;
  size?: number;
  type?: EditorItem;
  isEditor?: boolean;
}

export const itemGetter = (
  itemName: string,
  ctx: Phaser.Scene,
  cfg: EditorConfig
) => {
  const config = { ...cfg, isEditor: true };
  switch (itemName) {
    case EditorItem.ASTEROID:
      return new Asteroid(ctx, config);
    default:
      return new Platform(ctx, config);
  }
};
