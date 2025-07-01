import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { ModalOverlay } from "../../../shared/ui/ModalOverlay";

const FAQContent = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
`;

const FAQSection = styled.div`
  margin-bottom: 2rem;
`;

const FAQTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const FAQText = styled.p`
  color: #666;
  margin: 0.5rem 0;
  line-height: 1.5;
`;

interface EditorFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditorFAQModal: React.FC<EditorFAQModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <FAQContent>
        <FAQSection>
          <FAQTitle>{t("editor.faq.title")}</FAQTitle>
          <FAQText>{t("editor.faq.selectPlatform")}</FAQText>
          <FAQText>{t("editor.faq.placeObject")}</FAQText>
          <FAQText>{t("editor.faq.resizeObject")}</FAQText>
          <FAQText>{t("editor.faq.dragObject")}</FAQText>
          <FAQText>{t("editor.faq.resetObject")}</FAQText>
          <FAQText>{t("editor.faq.deleteObject")}</FAQText>
        </FAQSection>

        <FAQSection>
          <FAQTitle>{t("editor.faq.cameraTitle")}</FAQTitle>
          <FAQText>{t("editor.faq.cameraLeft")}</FAQText>
          <FAQText>{t("editor.faq.cameraRight")}</FAQText>
        </FAQSection>

        <FAQSection>
          <FAQTitle>{t("editor.faq.saveLoadTitle")}</FAQTitle>
          <FAQText>{t("editor.faq.saveLoadDesc")}</FAQText>
          <FAQText>{t("editor.faq.createLevels")}</FAQText>
        </FAQSection>
      </FAQContent>
    </ModalOverlay>
  );
};
