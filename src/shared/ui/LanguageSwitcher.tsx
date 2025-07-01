import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const LanguageSwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LanguageButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border: 2px solid #fff;
  background: ${(props) => (props.$active ? "#fff" : "transparent")};
  color: ${(props) => (props.$active ? "#000" : "#fff")};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.$active ? "#f0f0f0" : "rgba(255, 255, 255, 0.1)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LanguageLabel = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  min-width: 100px;
`;

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageSwitcherContainer>
      <LanguageLabel>{t("settings.language")}:</LanguageLabel>
      <LanguageButton
        $active={i18n.language === "ru"}
        onClick={() => changeLanguage("ru")}
      >
        RU
      </LanguageButton>
      <LanguageButton
        $active={i18n.language === "en"}
        onClick={() => changeLanguage("en")}
      >
        EN
      </LanguageButton>
    </LanguageSwitcherContainer>
  );
};
