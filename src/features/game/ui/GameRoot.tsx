import React, { useState } from "react";
import Game from "./Game";
import LevelEditor from "./levelEditor";
import styled from "styled-components";
import { Button } from "../../../shared";
import { useStore } from "../../../shared/store";
import { GameMode } from "../../../shared/types/game.ts";
import { EditorFAQModal } from "./EditorFAQModal";
import { FAQIcon } from "../../../shared/ui/icons/FAQIcon";

const GameRootWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  gap: 1rem;
`;

const FAQButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
`;

export const GameRoot: React.FC = () => {
  const { mode, setMode } = useStore();
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div onContextMenu={handleContextMenu}>
      <GameRootWrapper>
        <Button onClick={() => setMode(GameMode.PLAY)}>Играть</Button>
        <Button onClick={() => setMode(GameMode.EDITOR)}>Редактор</Button>
        <FAQButton onClick={() => setIsFAQOpen(true)}>
          <FAQIcon />
        </FAQButton>
      </GameRootWrapper>
      {mode === GameMode.PLAY ? <Game /> : <LevelEditor />}
      <EditorFAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
    </div>
  );
};
