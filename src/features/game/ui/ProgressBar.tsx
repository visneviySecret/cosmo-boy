import React from "react";
import styled from "styled-components";
import { frameSizes } from "../utils/player";

interface ProgressBarProps {
  currentExperience: number;
  maxExperience: number;
  level: number;
}

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  padding: 15px;
  border: 2px solid #ffd700;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const ProgressBarTitle = styled.div`
  color: #ffd700;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  font-family: "Arial", sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const ProgressBarWrapper = styled.div`
  width: 200px;
  height: 20px;
  background: #333;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #555;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const ProgressBarFill = styled.div<{
  $percentage: number;
  $isMaxLevel: boolean;
}>`
  height: 100%;
  width: ${(props) => props.$percentage}%;
  background: ${(props) =>
    props.$isMaxLevel
      ? "linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f, #4ecdc4)"
      : "linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f)"};
  border-radius: 10px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 217, 61, 0.5);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.2) 100%
    );
    border-radius: 10px;
  }
`;

const ProgressText = styled.div`
  color: #fff;
  font-size: 12px;
  text-align: center;
  margin-top: 5px;
  font-family: "Arial", sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentExperience,
  maxExperience,
  level,
}) => {
  const isMaxLevel = level >= frameSizes.length;
  const percentage = Math.min((currentExperience / maxExperience) * 100, 100);
  const remainingExperience = maxExperience - currentExperience;

  return (
    <ProgressBarContainer>
      <ProgressBarTitle>
        Шкала толстоты - Уровень {level}
        {isMaxLevel && " (МАКС)"}
      </ProgressBarTitle>
      <ProgressBarWrapper>
        <ProgressBarFill $percentage={percentage} $isMaxLevel={isMaxLevel} />
      </ProgressBarWrapper>
      <ProgressText>
        {currentExperience} / {maxExperience}
        {!isMaxLevel &&
          remainingExperience > 0 &&
          ` (осталось: ${remainingExperience})`}
        {isMaxLevel && " (максимальный уровень)"}
      </ProgressText>
    </ProgressBarContainer>
  );
};
