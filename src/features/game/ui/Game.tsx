import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import styled from "styled-components";
import { Asteroid } from "../entities/Asteroid";
import { Player } from "../entities/Player";
import { AimLine } from "../entities/AimLine";
import { handleCollision } from "../utils/collisionHandler";

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
      // Создаем астероиды
      const asteroidPositions = [
        {
          x: this.cameras.main.centerX - 300,
          y: this.cameras.main.centerY + 600,
        },
        {
          x: this.cameras.main.centerX + 300,
          y: this.cameras.main.centerY + 600,
        },
      ];

      asteroids = asteroidPositions.map(
        (pos) => new Asteroid(this, { x: pos.x, y: pos.y })
      );

      // Создаем игрока на первом астероиде
      const PLAYER_SIZE = 100; // Размер игрока
      player = new Player(this, {
        x: asteroidPositions[0].x,
        y:
          asteroidPositions[0].y - asteroids[0].getSize() / 2 - PLAYER_SIZE / 2, // Размещаем игрока на поверхности астероида
      });
      player.setIsOnMeteorite(true); // Устанавливаем флаг, что игрок находится на астероиде

      // Создаем линию наводки
      aimLine = new AimLine(this);
      (this as any).aimLine = aimLine; // Сохраняем ссылку на AimLine в сцене

      // Добавляем коллизии между игроком и всеми астероидами
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
