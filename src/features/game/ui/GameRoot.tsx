import React, { useState } from "react";
import Game from "./Game";
import LevelEditor from "./levelEditor";
import styled from "styled-components";

const GameRootWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  gap: 1rem;
`;

export const GameRoot: React.FC = () => {
  const [mode, setMode] = useState<"game" | "editor">("game");

  return (
    <div>
      <GameRootWrapper>
        <button onClick={() => setMode("game")}>Играть</button>
        <button onClick={() => setMode("editor")}>Редактор</button>
      </GameRootWrapper>
      {mode === "game" ? <Game /> : <LevelEditor />}
    </div>
  );
};
