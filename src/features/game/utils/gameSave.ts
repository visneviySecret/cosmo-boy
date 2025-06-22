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
    collectedFoodPositions: player.getCollectedFoodPositions(),
  };

  localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(gameSave));
}

export function loadGame(): GameSave | null {
  const savedGame = localStorage.getItem(GAME_SAVE_KEY);
  if (savedGame) {
    try {
      const parsedGame = JSON.parse(savedGame);
      // Обеспечиваем обратную совместимость со старыми сохранениями
      if (!parsedGame.collectedFoodPositions) {
        parsedGame.collectedFoodPositions = [];
      }
      return parsedGame as GameSave;
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
