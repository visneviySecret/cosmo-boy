import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import styled from "styled-components";
import { Asteroid } from "../entities/Asteroid";
import { Player } from "../entities/Player";
import { AimLine } from "../entities/AimLine";
import { handleCollision } from "../utils/collisionHandler";
import { generateAsteroids } from "../utils/asteroidGenerator";

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
          debug: false,
        },
      },
      scene: {
        create: create,
        update: update,
      },
    };

    gameRef.current = new Phaser.Game(config);

    let asteroids: Asteroid[] = [];
    let player: Player;
    let aimLine: AimLine;

    function create(this: Phaser.Scene) {
      // Создаем линию наводки
      aimLine = new AimLine(this);
      (this as any).aimLine = aimLine;

      // Генерируем астероиды
      asteroids = generateAsteroids(this, aimLine);

      // Создаем игрока на левом астероиде
      const leftAsteroid = asteroids[0];
      player = new Player(this, {
        x: leftAsteroid.x,
        y: leftAsteroid.y - leftAsteroid.getSize() / 2,
      });
      // Устанавливаем позицию игрока с учетом его размера
      player.y -= player.getSize() / 2;
      player.setIsOnMeteorite(true);

      // Настраиваем камеру для следования за игроком
      this.cameras.main.startFollow(player, true);
      this.cameras.main.setFollowOffset(0, 0);
      this.cameras.main.setBounds(
        0,
        0,
        Number.MAX_SAFE_INTEGER,
        this.cameras.main.height
      );

      // Настраиваем коллизии между игроком и астероидами
      asteroids.forEach((asteroid) => {
        this.physics.add.collider(
          player,
          asteroid,
          (obj1: unknown, obj2: unknown) => {
            const playerObj = obj1 as Player;
            const asteroidObj = obj2 as Asteroid;
            handleCollision(playerObj, asteroidObj);
            aimLine.reset();
          },
          undefined,
          this
        );
      });

      // Добавляем обработчик изменения размера окна
      window.addEventListener("resize", () => {
        this.scale.resize(window.innerWidth, window.innerHeight);
      });
    }

    function update(this: Phaser.Scene) {
      if (player && asteroids.length > 0 && aimLine) {
        aimLine.update(player);

        const rightmostAsteroid = asteroids.reduce((prev, current) =>
          current.x > prev.x ? current : prev
        );

        // Если правый астероид виден, генерируем новые астероиды
        if (rightmostAsteroid.isVisible()) {
          const newAsteroids = generateAsteroids(this, aimLine);
          newAsteroids.forEach((newAsteroid) => {
            // Смещаем новые астероиды вправо от самого правого
            newAsteroid.x += rightmostAsteroid.x + aimLine.getCurrentLength();
            asteroids.push(newAsteroid);

            // Добавляем коллизию с игроком
            this.physics.add.collider(
              player,
              newAsteroid,
              (obj1: unknown, obj2: unknown) => {
                const playerObj = obj1 as Player;
                const asteroidObj = obj2 as Asteroid;
                handleCollision(playerObj, asteroidObj);
                aimLine.reset();
              },
              undefined,
              this
            );
          });
        }

        // Удаляем невидимые астероиды слева от игрока
        asteroids = asteroids.filter((asteroid) => {
          if (
            !asteroid.isVisible() &&
            asteroid.x < player.x - this.cameras.main.width
          ) {
            asteroid.destroy();
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
