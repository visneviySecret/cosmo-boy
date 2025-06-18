import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scrollUp = keyframes`
  from {
    transform: translateY(100vh);
  }
  to {
    transform: translateY(-100vh);
  }
`;

const CreditsOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  overflow: hidden;
`;

const CreditsContainer = styled.div`
  text-align: center;
  color: white;
  font-family: "Arial", sans-serif;
  animation: ${scrollUp} 20s linear infinite;
  padding: 50px;
`;

const GameTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeIn} 2s ease-in-out;
`;

const Section = styled.div`
  margin: 3rem 0;
  animation: ${fadeIn} 2s ease-in-out;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffd700;
`;

const CreditText = styled.p`
  font-size: 1.5rem;
  margin: 0.5rem 0;
  line-height: 1.6;
`;

const SpecialThanks = styled.div`
  font-size: 1.8rem;
  margin: 2rem 0;
  padding: 2rem;
  border: 2px solid #ffd700;
  border-radius: 10px;
  background: rgba(255, 215, 0, 0.1);
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

interface CreditsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Credits: React.FC<CreditsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <CreditsOverlay $isOpen={isOpen}>
      <CloseButton onClick={onClose}>Закрыть</CloseButton>
      <CreditsContainer>
        <GameTitle>Cosmo Boy</GameTitle>

        <Section>
          <SectionTitle>Разработка</SectionTitle>
          <CreditText>Игровая механика и программирование</CreditText>
          <CreditText>Графический дизайн и анимация</CreditText>
          <CreditText>Звуковое оформление</CreditText>
        </Section>

        <Section>
          <SectionTitle>Технологии</SectionTitle>
          <CreditText>Phaser.js - игровой движок</CreditText>
          <CreditText>React - пользовательский интерфейс</CreditText>
          <CreditText>TypeScript - разработка</CreditText>
          <CreditText>Styled Components - стилизация</CreditText>
        </Section>

        <Section>
          <SectionTitle>Особая благодарность</SectionTitle>
          <SpecialThanks>
            <CreditText>
              Всем игрокам, которые отправились в это космическое путешествие
            </CreditText>
            <CreditText>
              Сообществу разработчиков за поддержку и вдохновение
            </CreditText>
          </SpecialThanks>
        </Section>

        <Section>
          <SectionTitle>История космонавта</SectionTitle>
          <CreditText>
            Маленький космонавт начал свой путь как крошечный исследователь
          </CreditText>
          <CreditText>
            Питаясь космической едой, он рос и становился сильнее
          </CreditText>
          <CreditText>Преодолевая препятствия и избегая опасностей</CreditText>
          <CreditText>
            Он достиг своей цели и стал настоящим толстячком космоса
          </CreditText>
        </Section>

        <Section>
          <SectionTitle>Финал</SectionTitle>
          <CreditText>Спасибо за игру!</CreditText>
          <CreditText>Космос ждет новых героев...</CreditText>
        </Section>

        <Section style={{ marginTop: "5rem" }}>
          <CreditText style={{ fontSize: "1.2rem", opacity: 0.7 }}>
            © 2025 Cosmo Boy Game
          </CreditText>
        </Section>
      </CreditsContainer>
    </CreditsOverlay>
  );
};
