import { useEffect, useRef } from "react";
import Phaser from "phaser";
import styled from "styled-components";

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
`;

const Game = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "game-container",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      scene: {
        create: create,
      },
    };

    gameRef.current = new Phaser.Game(config);

    function create(this: Phaser.Scene) {
      // Добавляем текст в центр экрана
      const text = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          "Hello Phaser!",
          {
            color: "#ffffff",
            fontSize: "32px",
          }
        )
        .setOrigin(0.5);

      // Добавляем обработчик изменения размера окна
      window.addEventListener("resize", () => {
        this.scale.resize(window.innerWidth, window.innerHeight);
        text.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
      });
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <GameContainer id="game-container" />;
};

export default Game;
