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

  useEffect(() => {
    gameEndLogicRef.current = new GameEndLogic(gameObjectsRef, () => {
      // Запускаем музыку титров при показе титров
      if (musicManagerRef.current) {
        musicManagerRef.current.playCreditsMusic();
      }
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
    if (gameStarted && !isMenuOpen) {
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
  }, [gameStarted, isMenuOpen]);

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

      if (player.getLevel() !== 6 && level) {
        const { platforms } = generateGameObjectsFromLevel(this, player, level);
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

      const scoreText = this.add.text(
        -620,
        -620,
        `Собрано: ${player.getCollectedItems()}`,
        {
          fontSize: "48px",
          color: "#fff",
          stroke: "#000",
          strokeThickness: 6,
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
        }
      );
      scoreText.setScrollFactor(0);
      scoreText.setDepth(900);

      (this as any).scoreText = scoreText;
      this.cameras.main.setZoom(0.5);
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
        initializeGame(true);
        setTimeout(() => {
          setGameStarted(true);
        }, 2000);
      });

      window.addEventListener("resize", () => {
        this.scale.resize(window.innerWidth, window.innerHeight);
      });

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
          const CAMERA_SPEED = 2;
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
