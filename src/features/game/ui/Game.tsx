import React, { useEffect, useRef, useState, useCallback } from "react";
import Phaser from "phaser";
import styled from "styled-components";
import { Player } from "../entities/Player";
import { AimLine } from "../entities/AimLine";
import { generatePlatforms } from "../utils/platformsGenerator";
import { createFoodCollision } from "../utils/foodCollisionHandler";
import { loadLevel, generateGameObjectsFromLevel } from "../utils/customLevel";
import { preload } from "../utils/scene";
import type { GameObjects } from "../../../shared/types/game";
import { default as GameMenu } from "../../menu/ui/GameMenu";
import {
  saveGame,
  loadGame,
  hasSavedGame,
  deleteSavedGame,
} from "../utils/gameSave";

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
`;

const Game = React.memo(() => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const playerRef = useRef<Player | null>(null);
  const sceneRef = useRef<Phaser.Scene | null>(null);

  useEffect(() => {
    if (hasSavedGame()) {
      if (process.env.NODE_ENV === "development") {
        continueGame();
        setIsMenuOpen(false);
      }
    }
  }, []);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (gameStarted) {
          setIsMenuOpen(!isMenuOpen);
        } else {
          setIsMenuOpen(true);
        }
      }
    },
    [isMenuOpen, gameStarted]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const startNewGame = useCallback(() => {
    deleteSavedGame();
    initializeGame(false);
    setGameStarted(true);
  }, []);

  const continueGame = useCallback(() => {
    initializeGame(true);
    setGameStarted(true);
  }, []);

  const restartLevel = useCallback(() => {
    initializeGame(false);
    setGameStarted(true);
  }, []);

  const initializeGame = useCallback((loadFromSave: boolean) => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "game-root",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
        },
      },
      scene: {
        create: create,
        update: update,
        preload: preload,
      },
    };

    gameRef.current = new Phaser.Game(config);

    let gameObjects: GameObjects[] = [];
    let player: Player;
    let aimLine: AimLine;

    function create(this: Phaser.Scene) {
      sceneRef.current = this;

      aimLine = new AimLine(this);
      (this as any).aimLine = aimLine;

      player = new Player(this, {
        x: this.cameras.main.width / 4,
        y: this.cameras.main.height * 0.75,
      });

      playerRef.current = player;
      player.setIsOnPlatform(true);
      let level;

      if (loadFromSave) {
        const savedGame = loadGame();
        if (savedGame) {
          level = loadLevel(savedGame.playerLevel)!;
          player.loadFromSave(
            savedGame.playerLevel,
            savedGame.playerExperience,
            savedGame.collectedItems,
            savedGame.playerX,
            savedGame.playerY
          );
        }
      } else {
        level = loadLevel(1);
      }

      if (level) {
        if (level.getLevelName() !== "Уровень 6") {
          const { platforms } = generateGameObjectsFromLevel(
            this,
            player,
            level
          );
          gameObjects = [...platforms];

          if (platforms.length > 0 && !loadFromSave) {
            const first = platforms[0];
            player.x = first.x;
            player.y = first.y - first.getSize() / 2 - player.getSize() / 2;
          }
        } else {
          // --- Генерация стандартных астероидов ---
          const { asteroids: initialAsteroids, foodGroup } = generatePlatforms(
            this,
            aimLine,
            player
          );
          gameObjects = initialAsteroids;
          createFoodCollision(this, player, foodGroup);
          if (!loadFromSave) {
            const leftAsteroid = gameObjects[0];
            player.x = leftAsteroid.x;
            player.y =
              leftAsteroid.y -
              leftAsteroid.getSize() / 2 -
              player.getSize() / 2;
          }
        }
      }
      const scoreText = this.add.text(
        16,
        16,
        `Собрано: ${player.getCollectedItems()}`,
        {
          fontSize: "32px",
          color: "#fff",
          stroke: "#000",
          strokeThickness: 4,
        }
      );
      scoreText.setScrollFactor(0);

      (this as any).scoreText = scoreText;
      // Настраиваем камеру для следования за игроком
      this.cameras.main.startFollow(player, true);
      this.cameras.main.setFollowOffset(0, 0);
      this.cameras.main.setBounds(
        0,
        0,
        Number.MAX_SAFE_INTEGER,
        this.cameras.main.height
      );

      const updateCameraSettings = () => {
        if (player.getLevel() >= 6 && player.isInFlightMode()) {
          this.cameras.main.stopFollow();
        } else {
          this.cameras.main.startFollow(player, true);
        }
      };

      this.time.addEvent({
        delay: 1000,
        callback: updateCameraSettings,
        loop: true,
      });

      // Добавляем обработчик изменения размера окна
      window.addEventListener("resize", () => {
        this.scale.resize(window.innerWidth, window.innerHeight);
      });

      // Автосохранение каждые 10 секунд
      this.time.addEvent({
        delay: 10000,
        callback: () => {
          if (playerRef.current) {
            saveGame(playerRef.current);
          }
        },
        loop: true,
      });
    }

    function update(this: Phaser.Scene) {
      if (player && gameObjects.length > 0 && aimLine) {
        aimLine.update(player);

        if (player.getLevel() >= 6 && player.isInFlightMode()) {
          const CAMERA_SPEED = 2;
          this.cameras.main.scrollX += CAMERA_SPEED;

          const leftBound =
            this.cameras.main.scrollX - this.cameras.main.width * 0.3;
          if (player.x < leftBound) {
            player.x = leftBound;
          }
        }

        const rightmostAsteroid = gameObjects[gameObjects.length - 1];

        // Если самый правый астероид появился на экране, генерируем новые астероиды
        if (rightmostAsteroid.isVisible()) {
          const { asteroids: newAsteroids, foodGroup } = generatePlatforms(
            this,
            aimLine,
            player,
            rightmostAsteroid.x + aimLine.getCurrentLength(),
            rightmostAsteroid.y
          );
          gameObjects.push(...newAsteroids);

          // Добавляем обработчик столкновений для новой группы еды
          createFoodCollision(this, player, foodGroup);
        }

        // Удаляем невидимые астероиды слева от игрока
        gameObjects = gameObjects.filter((object) => {
          // Проверяем, что объект не уничтожен
          if (!object.scene) {
            return false;
          }

          // Удаляем объекты, которые находятся далеко слева от игрока и не видны
          if (
            object.isVisible &&
            !object.isVisible() &&
            object.x < player.x - this.cameras.main.width
          ) {
            object.destroy();
            return false;
          }
          return true;
        });
      }
    }
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <GameContainer id="game-root" />
      <GameMenu
        isOpen={isMenuOpen}
        onStartNewGame={startNewGame}
        onContinueGame={continueGame}
        onClose={closeMenu}
      />
    </>
  );
});

export default Game;
