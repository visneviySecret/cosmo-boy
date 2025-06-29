import type { GameObjects } from "../../../shared/types/game";
import type { Player } from "../entities/Player";
import { levelWhiteGlow } from "../animations/level";
import { ParallaxBackground } from "../entities/ParallaxBackground";

export class GameEndLogic {
  private gameEndTriggered: boolean = false;
  private gameObjectsRef: React.RefObject<GameObjects[]>;
  private onShowCredits: () => void;

  constructor(
    gameObjectsRef: React.RefObject<GameObjects[]>,
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

        // Учитываем zoom камеры при проверке видимости
        const actualCameraWidth = camera.width / camera.zoom;
        const actualCameraHeight = camera.height / camera.zoom;

        // Проверяем, находится ли объект в поле зрения камеры с учетом zoom
        const isInView =
          object.x > camera.scrollX - object.getSize() &&
          object.x < camera.scrollX + actualCameraWidth + object.getSize() &&
          object.y > camera.scrollY - object.getSize() &&
          object.y < camera.scrollY + actualCameraHeight + object.getSize();

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

    // Учитываем zoom камеры при определении видимых астероидов
    const actualCameraWidth = camera.width / camera.zoom;

    const visibleAsteroids = this.gameObjectsRef.current.filter((object) => {
      if (!object.scene) return false;
      // Проверяем, находится ли объект в поле зрения камеры с учетом zoom
      return (
        object.x > camera.scrollX - object.getSize() &&
        object.x < camera.scrollX + actualCameraWidth * 2 + object.getSize()
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

  public shouldGenerateAsteroids(playerLevel: number): boolean {
    return !this.gameEndTriggered && playerLevel === 6;
  }

  public reset(): void {
    this.gameEndTriggered = false;
  }

  public isGameEnded(): boolean {
    return this.gameEndTriggered;
  }
}
