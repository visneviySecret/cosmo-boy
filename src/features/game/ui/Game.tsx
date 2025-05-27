import { useEffect, useRef } from "react";
import Phaser from "phaser";
import styled from "styled-components";

const GameContainer = styled.div`
  margin-top: 20px;
  border: 2px solid #61dafb;
  border-radius: 8px;
  overflow: hidden;
`;

const Game = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    gameRef.current = new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      // Здесь будет загрузка ассетов
    }

    function create(this: Phaser.Scene) {
      // Здесь будет инициализация игры
      this.add
        .text(400, 300, "Hello Phaser!", {
          color: "#ffffff",
          fontSize: "32px",
        })
        .setOrigin(0.5);
    }

    function update(this: Phaser.Scene) {
      // Здесь будет игровая логика
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <GameContainer />;
};

export default Game;
