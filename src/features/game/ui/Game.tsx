import React, { useEffect, useRef, useState, useCallback } from "react";
import Phaser from "phaser";
import styled from "styled-components";
import { Player } from "../entities/Player";
import { AimLine } from "../entities/AimLine";
import { ParallaxBackground } from "../entities/ParallaxBackground";
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
import { GameEndLogic } from "../utils/gameEndLogic";
import { Credits } from "../../../shared/ui/Credits";
import { useStore } from "../../../shared/store";
import { MusicManager } from "../../../shared/utils/MusicManager";
import { ProgressBar } from "./ProgressBar";
import { usePlayerProgress } from "../hooks/usePlayerProgress";

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
`;

const AudioPrompt = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

const Game = React.memo(() => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const playerRef = useRef<Player | null>(null);
  const sceneRef = useRef<Phaser.Scene | null>(null);
  const gameObjectsRef = useRef<GameObjects[]>([]);
  const gameEndLogicRef = useRef<GameEndLogic | null>(null);
  const parallaxBackgroundRef = useRef<ParallaxBackground | null>(null);
  const musicManagerRef = useRef<MusicManager | null>(null);
  const { setCameraPosition } = useStore();

  // Добавляем хук для отслеживания прогресса игрока
  const playerProgress = usePlayerProgress(playerRef.current);

  // Добавляем состояние для управления автосохранением
  const autoSaveEnabledRef = useRef<boolean>(true);
  const autoSaveTimerRef = useRef<Phaser.Time.TimerEvent | null>(null);

  // Функция для определения оптимального зума камеры
  const getCameraZoom = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Для Full HD (1920x1080) и близких разрешений используем меньший зум
    if (width >= 1920 && height >= 1080) {
      return 0.25;
    }

    // Для остальных разрешений используем стандартный зум
    return 0.5;
  }, []);

  useEffect(() => {
    gameEndLogicRef.current = new GameEndLogic(gameObjectsRef, () => {
      setShowCredits(true);
    });
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      if (hasSavedGame()) {
        continueGame();
        setIsMenuOpen(false);
      }
    }
  }, []);

  useEffect(() => {
    if (gameStarted) {
      setShowAudioPrompt(true);

      const hidePrompt = () => {
        setShowAudioPrompt(false);
        if (musicManagerRef.current) {
          musicManagerRef.current.forcePlayLevelMusic();
        }
        document.removeEventListener("click", hidePrompt);
        document.removeEventListener("keydown", hidePrompt);
        document.removeEventListener("touchstart", hidePrompt);
      };

      document.addEventListener("click", hidePrompt, { once: true });
      document.addEventListener("keydown", hidePrompt, { once: true });
      document.addEventListener("touchstart", hidePrompt, { once: true });

      const timer = setTimeout(() => {
        hidePrompt();
      }, 5000);

      return () => {
        clearTimeout(timer);
        hidePrompt();
      };
    }
  }, [gameStarted]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (gameStarted) {
          const newMenuState = !isMenuOpen;
          setIsMenuOpen(newMenuState);

          if (newMenuState && musicManagerRef.current) {
            // При открытии меню приостанавливаем игровую музыку
            musicManagerRef.current.pauseCurrentTrack();
          } else if (!newMenuState && musicManagerRef.current) {
            // При закрытии меню возобновляем игровую музыку
            musicManagerRef.current.resumeCurrentTrack();
          }
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

  const initializeGame = useCallback((loadFromSave: boolean) => {
    gameObjectsRef.current = [];
    gameEndLogicRef.current?.reset();

    // Очищаем предыдущий таймер автосохранения
    if (autoSaveTimerRef.current) {
      autoSaveTimerRef.current.destroy();
      autoSaveTimerRef.current = null;
    }

    // Сбрасываем флаг автосохранения
    autoSaveEnabledRef.current = true;

    if (parallaxBackgroundRef.current) {
      parallaxBackgroundRef.current.destroy();
      parallaxBackgroundRef.current = null;
    }

    if (musicManagerRef.current) {
      musicManagerRef.current.destroy();
      musicManagerRef.current = null;
    }

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
    let parallaxBackground: ParallaxBackground;

    function create(this: Phaser.Scene) {
      sceneRef.current = this;

      parallaxBackground = new ParallaxBackground(this);
      parallaxBackgroundRef.current = parallaxBackground;

      aimLine = new AimLine(this);
      (this as any).aimLine = aimLine;

      player = new Player(this, {
        x: this.cameras.main.width / 4,
        y: this.cameras.main.height * 0.75,
      });

      playerRef.current = player;
      (this as any).player = player;
      player.setIsOnPlatform(true);
      let level;

      if (loadFromSave) {
        const savedGame = loadGame();
        if (savedGame) {
          level = loadLevel(1)!;
          player.loadFromSave(
            savedGame.playerLevel,
            savedGame.playerExperience,
            savedGame.collectedItems,
            savedGame.playerX,
            savedGame.playerY,
            savedGame.collectedFoodPositions
          );

          // Сохраняем информацию о собранной еде для использования ниже
          (this as any).collectedFoodPositions =
            savedGame.collectedFoodPositions;
        }
      } else {
        level = loadLevel(1);
      }

      if (player.getLevel() !== 6 && level) {
        const collectedPositions = loadFromSave
          ? (this as any).collectedFoodPositions || []
          : [];
        const { platforms } = generateGameObjectsFromLevel(
          this,
          player,
          level,
          collectedPositions
        );
        gameObjects = [...platforms];
        gameObjectsRef.current = gameObjects;

        if (platforms.length > 0 && !loadFromSave) {
          const first = platforms[0];
          player.x = first.x;
          player.y = first.y - first.getSize() / 2 - player.getSize() / 2;
        }
      } else {
        const { asteroids: initialAsteroids, foodGroup } = generatePlatforms(
          this,
          aimLine,
          player
        );
        gameObjects = initialAsteroids;
        gameObjectsRef.current = gameObjects;
        createFoodCollision(this, player, foodGroup);
        if (!loadFromSave) {
          const leftAsteroid = gameObjects[0];
          player.x = leftAsteroid.x;
          player.y =
            leftAsteroid.y - leftAsteroid.getSize() / 2 - player.getSize() / 2;
        }
      }

      if (this.cache && this.sound) {
        musicManagerRef.current = new MusicManager(this);
        musicManagerRef.current.initialize();
        musicManagerRef.current.setCurrentPlayerLevel(player.getLevel());
      }

      this.events.on("level-up", (newLevel: number) => {
        if (musicManagerRef.current) {
          musicManagerRef.current.setCurrentPlayerLevel(newLevel);
          musicManagerRef.current.playLevelMusic(newLevel);
        }
      });

      this.cameras.main.setZoom(getCameraZoom());
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

      this.events.on("restartLevel", () => {
        // При перезапуске уровня снова включаем автосохранение
        autoSaveEnabledRef.current = true;
        initializeGame(true);
        setTimeout(() => {
          setGameStarted(true);
        }, 2000);
      });

      // Обработчик смерти от брауни - отключаем автосохранение
      this.events.on("browny-death", () => {
        autoSaveEnabledRef.current = false;
        // Останавливаем текущий таймер автосохранения, если он есть
        if (autoSaveTimerRef.current) {
          autoSaveTimerRef.current.destroy();
          autoSaveTimerRef.current = null;
        }
      });

      window.addEventListener("resize", () => {
        this.scale.resize(window.innerWidth, window.innerHeight);
        // Пересчитываем зум при изменении размера окна
        this.cameras.main.setZoom(getCameraZoom());
      });

      // Создаем управляемый таймер автосохранения
      autoSaveTimerRef.current = this.time.addEvent({
        delay: 10000,
        callback: () => {
          if (playerRef.current && autoSaveEnabledRef.current) {
            saveGame(playerRef.current);
          }
        },
        loop: true,
      });
    }

    function update(this: Phaser.Scene) {
      if (parallaxBackgroundRef.current) {
        parallaxBackgroundRef.current.update();
      }

      setCameraPosition(this.cameras.main.scrollX, this.cameras.main.scrollY);

      if (
        player &&
        gameObjectsRef.current.length > 0 &&
        aimLine &&
        gameEndLogicRef.current
      ) {
        aimLine.update(player);

        gameEndLogicRef.current.checkGameEnd(player);

        if (player.getLevel() >= 6 && player.isInFlightMode()) {
          const CAMERA_SPEED = 6;
          this.cameras.main.scrollX += CAMERA_SPEED;

          const leftBound =
            this.cameras.main.scrollX - this.cameras.main.width * 0.3;
          if (player.x < leftBound) {
            player.x = leftBound;
          }
        }

        if (
          gameEndLogicRef.current.shouldGenerateAsteroids(player.getLevel())
        ) {
          const rightmostAsteroid =
            gameObjectsRef.current[gameObjectsRef.current.length - 1];

          if (rightmostAsteroid && rightmostAsteroid.isVisible()) {
            const { asteroids: newAsteroids, foodGroup } = generatePlatforms(
              this,
              aimLine,
              player,
              rightmostAsteroid.x + aimLine.getCurrentLength(),
              rightmostAsteroid.y
            );
            gameObjectsRef.current.push(...newAsteroids);
            createFoodCollision(this, player, foodGroup);
          }
        }

        const isLastLevel = player.getLevel() === 6;
        gameObjectsRef.current = gameObjectsRef.current.filter((object) => {
          if (!object.scene) {
            return false;
          }

          if (
            isLastLevel &&
            object.isVisible &&
            !object.isVisible() &&
            object.x < player.x - this.cameras.main.width
          ) {
            object.destroy();
            return false;
          }
          return true;
        });

        gameEndLogicRef.current.handleEndGameSequence(this);
      }
    }
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleCreditsClose = useCallback(() => {
    setShowCredits(false);
    setIsMenuOpen(true);
  }, []);

  useEffect(() => {
    return () => {
      // Очищаем таймер автосохранения
      if (autoSaveTimerRef.current) {
        autoSaveTimerRef.current.destroy();
        autoSaveTimerRef.current = null;
      }

      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <GameContainer id="game-root" />
      <AudioPrompt $show={showAudioPrompt}>
        🎵 Кликните в любом месте для включения музыки
      </AudioPrompt>
      {gameStarted && !isMenuOpen && (
        <ProgressBar
          currentExperience={playerProgress.experience}
          maxExperience={playerProgress.maxExperience}
          level={playerProgress.level}
        />
      )}
      <GameMenu
        isOpen={isMenuOpen}
        onStartNewGame={startNewGame}
        onContinueGame={continueGame}
        onClose={closeMenu}
        scene={sceneRef.current || undefined}
      />
      <Credits isOpen={showCredits} onClose={handleCreditsClose} />
    </>
  );
});

export default Game;
