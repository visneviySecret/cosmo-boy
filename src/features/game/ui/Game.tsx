import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import styled from "styled-components";
import { Player } from "../entities/Player";
import { AimLine } from "../entities/AimLine";
import { generateAsteroids } from "../utils/asteroidGenerator";
import { createFoodCollision } from "../utils/foodCollisionHandler";
import {
  loadCustomLevel,
  generateGameObjectsFromLevel,
} from "../utils/customLevel";
import { preload } from "../utils/scene";
import type { GameObjects } from "../../../shared/types/game";

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

  useEffect(() => {
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
      // Создаем линию наводки
      aimLine = new AimLine(this);
      (this as any).aimLine = aimLine;

      // Создаем игрока в начальной позиции
      player = new Player(this, {
        x: this.cameras.main.width / 4,
        y: this.cameras.main.height * 0.75,
      });
      player.setIsOnPlatform(true);

      // Создаем текст для отображения счётчика
      const scoreText = this.add.text(16, 16, "Собрано: 0", {
        fontSize: "32px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 4,
      });
      scoreText.setScrollFactor(0); // Фиксируем текст на экране

      // Сохраняем ссылку на текст в сцене
      (this as any).scoreText = scoreText;

      // --- Загрузка пользовательского уровня ---
      const customLevel = loadCustomLevel();
      if (customLevel) {
        const { platforms } = generateGameObjectsFromLevel(
          this,
          player,
          customLevel
        );
        gameObjects = [...platforms];

        // Разместить игрока на первой платформе, если есть
        if (platforms.length > 0) {
          const first = platforms[0];
          player.x = first.x;
          player.y = first.y - first.getSize() / 2 - player.getSize() / 2;
        }
      } else {
        // --- Генерация стандартных астероидов ---
        const { asteroids: initialAsteroids, foodGroup } = generateAsteroids(
          this,
          aimLine,
          player
        );
        gameObjects = initialAsteroids;
        // Добавляем обработчик столкновений с едой
        createFoodCollision(this, player, foodGroup);
        // Размещаем игрока на первом астероиде
        const leftAsteroid = gameObjects[0];
        player.x = leftAsteroid.x;
        player.y =
          leftAsteroid.y - leftAsteroid.getSize() / 2 - player.getSize() / 2;
      }

      // Настраиваем камеру для следования за игроком
      this.cameras.main.startFollow(player, true);
      this.cameras.main.setFollowOffset(0, 0);
      this.cameras.main.setBounds(
        0,
        0,
        Number.MAX_SAFE_INTEGER,
        this.cameras.main.height
      );

      // Добавляем обработчик изменения размера окна
      window.addEventListener("resize", () => {
        this.scale.resize(window.innerWidth, window.innerHeight);
      });
    }

    function update(this: Phaser.Scene) {
      if (player && gameObjects.length > 0 && aimLine) {
        aimLine.update(player);

        const rightmostAsteroid = gameObjects[gameObjects.length - 1];

        // Если самый правый астероид появился на экране, генерируем новые астероиды
        if (rightmostAsteroid.isVisible()) {
          const { asteroids: newAsteroids, foodGroup } = generateAsteroids(
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

    return () => {
      if (gameRef.current) {
        aimLine?.destroy();
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <GameContainer id="game-root" />;
});

export default Game;
