import type { GameObjects } from "../../../shared/types/game";
import type { Player } from "../entities/Player";
import { levelWhiteGlow } from "../animations/level";

export class GameEndLogic {
  private gameEndTriggered: boolean = false;
  private gameObjectsRef: React.MutableRefObject<GameObjects[]>;
  private onShowCredits: () => void;

  constructor(
    gameObjectsRef: React.MutableRefObject<GameObjects[]>,
    onShowCredits: () => void
  ) {
    this.gameObjectsRef = gameObjectsRef;
    this.onShowCredits = onShowCredits;
  }

  public checkGameEnd(player: Player): boolean {
    const isLastLevel = player.getLevel() === 6;
    const isGameEnd = isLastLevel && player.getExperience() >= 6;

    if (isGameEnd && !this.gameEndTriggered) {
      this.gameEndTriggered = true;
      this.removeOffScreenAsteroids(player);
      return true;
    }

    return this.gameEndTriggered;
  }

  private removeOffScreenAsteroids(player: Player): void {
    const scene = player.scene;
    const camera = scene.cameras.main;

    // Удаляем все астероиды, которые находятся за пределами экрана
    this.gameObjectsRef.current = this.gameObjectsRef.current.filter(
      (object) => {
        if (!object.scene) {
          return false;
        }

        // Проверяем, находится ли объект в поле зрения камеры
        const isInView =
          object.x > camera.scrollX - object.getSize() &&
          object.x < camera.scrollX + camera.width + object.getSize();

        if (!isInView) {
          object.destroy();
          return false;
        }

        return true;
      }
    );
  }

  public handleEndGameSequence(scene: Phaser.Scene): void {
    if (!this.gameEndTriggered) return;

    const camera = scene.cameras.main;
    const visibleAsteroids = this.gameObjectsRef.current.filter((object) => {
      if (!object.scene) return false;
      // Проверяем, находится ли объект в поле зрения камеры
      return (
        object.x > camera.scrollX - object.getSize() &&
        object.x < camera.scrollX + camera.width + object.getSize()
      );
    });

    // Если все астероиды исчезли из поля зрения, запускаем анимацию свечения
    if (visibleAsteroids.length === 0) {
      this.gameEndTriggered = false; // Сбрасываем флаг, чтобы анимация запустилась только один раз
      levelWhiteGlow(scene, () => {
        this.onShowCredits();
      });
    }
  }

  public shouldGenerateAsteroids(): boolean {
    return !this.gameEndTriggered;
  }

  public reset(): void {
    this.gameEndTriggered = false;
  }

  public isGameEnded(): boolean {
    return this.gameEndTriggered;
  }
}
