import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "../../../shared/ui/Button";
import { SETTINGS_KEY } from "../../game/utils/editorUtils";
import type { GameSettings } from "../../../shared/types/game";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 2rem;
  border-radius: 12px;
  min-width: 400px;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
  color: #fff;
  font-size: 2rem;
`;

const SettingItem = styled.div`
  margin-bottom: 1.5rem;
`;

const SettingLabel = styled.label`
  display: block;
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const VolumeSlider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
    border: none;
  }
`;

const VolumeValue = styled.span`
  color: #fff;
  font-size: 1rem;
  margin-left: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      const settings: GameSettings = JSON.parse(savedSettings);
      setVolume(settings.volume);
    }
  }, []);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);

    const settings: GameSettings = { volume: newVolume };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Настройки</Title>

        <SettingItem>
          <SettingLabel htmlFor="volume">
            Громкость звука
            <VolumeValue>{volume}%</VolumeValue>
          </SettingLabel>
          <VolumeSlider
            id="volume"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
          />
        </SettingItem>

        <ButtonContainer>
          <Button onClick={handleClose}>Закрыть</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};
