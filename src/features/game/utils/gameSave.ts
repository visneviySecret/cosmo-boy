import type { GameSave } from "../../../shared/types/game";
import type { Player } from "../entities/Player";

export const GAME_SAVE_KEY = "game_save";
export const SETTINGS_KEY = "game_settings";

export function saveGame(player: Player): void {
  const gameSave: GameSave = {
    playerLevel: player.getLevel(),
    playerExperience: player.getExperience(),
    collectedItems: player.getCollectedItems(),
    playerX: player.x,
    playerY: player.y,
    timestamp: Date.now(),
  };

  localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(gameSave));
}

export function loadGame(): GameSave | null {
  const savedGame = localStorage.getItem(GAME_SAVE_KEY);
  if (savedGame) {
    try {
      return JSON.parse(savedGame);
    } catch (error) {
      console.error("Ошибка при загрузке сохранения:", error);
      return null;
    }
  }
  return null;
}

export function hasSavedGame(): boolean {
  return !!localStorage.getItem(GAME_SAVE_KEY);
}

export function deleteSavedGame(): void {
  localStorage.removeItem(GAME_SAVE_KEY);
}
