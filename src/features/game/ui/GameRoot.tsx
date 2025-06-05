import React from "react";
import Game from "./Game";
import LevelEditor from "./levelEditor";
import styled from "styled-components";
import { Button } from "../../../shared";
import { useStore } from "../../../shared/store";
import { GameMode } from "../../../shared/types/game.ts";

const GameRootWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  gap: 1rem;
`;

export const GameRoot: React.FC = () => {
  const { mode, setMode } = useStore();

  return (
    <div>
      <GameRootWrapper>
        <Button onClick={() => setMode(GameMode.PLAY)}>Играть</Button>
        <Button onClick={() => setMode(GameMode.EDITOR)}>Редактор</Button>
      </GameRootWrapper>
      {mode === GameMode.PLAY ? <Game /> : <LevelEditor />}
    </div>
  );
};
