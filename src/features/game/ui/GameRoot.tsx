import React, { useState } from "react";
import Game from "./Game";
import LevelEditor from "./levelEditor";
import styled from "styled-components";
import { Button } from "../../../shared/ui/Button";
import { useStore } from "../../../shared/store";
import { GameMode } from "../../../shared/types/game";
import { EditorFAQModal } from "./EditorFAQModal";
import { FAQIcon } from "../../../shared/ui/icons/FAQIcon";
import { useTranslation } from "react-i18next";

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

export const isDemoRoute = window.location.pathname.includes("demo");

export const GameRoot: React.FC = () => {
  const { mode, setMode } = useStore();
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const { t } = useTranslation();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {(process.env.NODE_ENV === "development" || isDemoRoute) && (
        <GameRootWrapper>
          <Button onClick={() => setMode(GameMode.PLAY)}>
            {t("editor.play")}
          </Button>
          <Button onClick={() => setMode(GameMode.EDITOR)}>
            {t("editor.editor")}
          </Button>
          <FAQButton onClick={() => setIsFAQOpen(true)}>
            <FAQIcon />
          </FAQButton>
        </GameRootWrapper>
      )}
      {mode === GameMode.PLAY ? <Game /> : <LevelEditor />}
      <EditorFAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
    </div>
  );
};
