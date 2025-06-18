import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "../../../shared/ui/Button";
import { GAME_SAVE_KEY } from "../../game/utils/gameSave";
import { SettingsModal } from "./SettingsModal";

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("assets/images/menu-background.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  z-index: 2000;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: -1;
  }
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 10%;
  gap: 2rem;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const GameTitle = styled.h1`
  font-size: 4rem;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.9);
  margin-bottom: 2rem;
  font-family: "Arial", sans-serif;
  font-weight: bold;
`;

const MenuButton = styled(Button)<{ disabled?: boolean }>`
  font-size: 1.5rem;
  padding: 1.5rem 3rem;
  min-width: 300px;
  text-align: left;
  background: ${({ disabled }) =>
    disabled ? "rgba(102, 102, 102, 0.8)" : "rgba(255, 255, 255, 0.15)"};
  color: ${({ disabled }) => (disabled ? "#999" : "#fff")};
  border: 2px solid
    ${({ disabled }) =>
      disabled ? "rgba(102, 102, 102, 0.8)" : "rgba(255, 255, 255, 0.4)"};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  backdrop-filter: blur(10px);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);

  &:hover {
    background: ${({ disabled }) =>
      disabled ? "rgba(102, 102, 102, 0.8)" : "rgba(255, 255, 255, 0.25)"};
    border-color: ${({ disabled }) =>
      disabled ? "rgba(102, 102, 102, 0.8)" : "rgba(255, 255, 255, 0.6)"};
  }
`;

const ImgWrapper = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 1rem;
`;

interface GameMenuProps {
  isOpen: boolean;
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onClose: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({
  isOpen,
  onStartNewGame,
  onContinueGame,
  onClose,
}) => {
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedGame = localStorage.getItem(GAME_SAVE_KEY);
    setHasSavedGame(!!savedGame);
  }, [isOpen]);

  const handleStartNewGame = () => {
    onStartNewGame();
    onClose();
  };

  const handleContinueGame = () => {
    if (hasSavedGame) {
      onContinueGame();
      onClose();
    }
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const goToDeveloperPage = () => {
    window.open("https://github.com/visneviySecret/cosmo-boy", "_blank");
  };

  if (!isOpen) return null;

  return (
    <>
      <MenuOverlay>
        <MenuContent>
          <GameTitle>Cosmo Boy</GameTitle>

          <MenuButton onClick={handleStartNewGame}>Начать игру</MenuButton>

          <MenuButton onClick={handleContinueGame} disabled={!hasSavedGame}>
            Продолжить
          </MenuButton>

          <MenuButton onClick={handleSettings}>Настройки</MenuButton>
          <MenuButton onClick={() => goToDeveloperPage()}>
            <ImgWrapper>
              <img
                src="assets/images/github.png"
                alt="github"
                width={50}
                height={50}
              />
            </ImgWrapper>
            <span>Разработчик</span>
          </MenuButton>
        </MenuContent>
      </MenuOverlay>

      <SettingsModal isOpen={isSettingsOpen} onClose={handleCloseSettings} />
    </>
  );
};

export default GameMenu;
