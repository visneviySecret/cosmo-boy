import React, { useState } from "react";
import Game from "./Game";
import LevelEditor from "./levelEditor";
import styled from "styled-components";
import { Button } from "../../../shared";

const GameRootWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  gap: 1rem;
`;

export const GameRoot: React.FC = () => {
  const [mode, setMode] = useState<"game" | "editor">("editor");

  return (
    <div>
      <GameRootWrapper>
        <Button onClick={() => setMode("game")}>Играть</Button>
        <Button onClick={() => setMode("editor")}>Редактор</Button>
      </GameRootWrapper>
      {mode === "game" ? <Game /> : <LevelEditor />}
    </div>
  );
};
