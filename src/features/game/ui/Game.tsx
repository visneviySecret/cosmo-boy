import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import styled from "styled-components";
import { Meteorite } from "../entities/Meteorite";
import { Player } from "../entities/Player";

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

    let meteorite: Meteorite;
    let player: Player;

    function create(this: Phaser.Scene) {
      // Создаем метеорит
      meteorite = new Meteorite(this, {
        x: this.cameras.main.centerX,
        y: this.cameras.main.centerY + 600,
      });

      // Создаем игрока
      player = new Player(this, {
        x: this.cameras.main.centerX,
        y: this.cameras.main.centerY + 200,
      });

      // Добавляем коллизию между игроком и метеоритом
      this.physics.add.collider(
        player,
        meteorite,
        (obj1: unknown, obj2: unknown) => {
          const playerObj = obj1 as Player;
          const meteoriteObj = obj2 as Meteorite;
          handleCollision(playerObj, meteoriteObj);
        },
        undefined,
        this
      );

      // Добавляем обработчик изменения размера окна
      window.addEventListener("resize", () => {
        this.scale.resize(window.innerWidth, window.innerHeight);
      });
    }

    function handleCollision(player: Player, meteorite: Meteorite) {
      // Сохраняем скорости перед столкновением
      const playerVelocityX = player.body?.velocity.x || 0;
      const playerVelocityY = player.body?.velocity.y || 0;
      const meteoriteVelocityX = meteorite.body?.velocity.x || 0;
      const meteoriteVelocityY = meteorite.body?.velocity.y || 0;

      // Вычисляем общую массу
      const totalMass = player.getMass() + meteorite.getMass();

      // Вычисляем новую скорость с учетом импульсов обоих тел
      const newVelocityX =
        (playerVelocityX * player.getMass() +
          meteoriteVelocityX * meteorite.getMass()) /
        totalMass;
      const newVelocityY =
        (playerVelocityY * player.getMass() +
          meteoriteVelocityY * meteorite.getMass()) /
        totalMass;

      // Устанавливаем одинаковую скорость для метеорита и игрока
      meteorite.setVelocity(newVelocityX, newVelocityY);
      player.setVelocity(newVelocityX, newVelocityY);
    }

    function update(this: Phaser.Scene) {
      if (player && meteorite) {
        player.update(meteorite);
      }
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <GameContainer id="game-root" />;
});

export default Game;
