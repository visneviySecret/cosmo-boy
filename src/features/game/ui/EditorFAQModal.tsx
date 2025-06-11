import React from "react";
import { ModalOverlay } from "../../../shared/ui/ModalOverlay";
import styled from "styled-components";

const FAQContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FAQTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const FAQText = styled.p`
  margin: 0;
  color: #666;
  line-height: 1.5;
`;

type EditorFAQModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const EditorFAQModal: React.FC<EditorFAQModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <FAQContent>
        <FAQSection>
          <FAQTitle>Основные функции редактора:</FAQTitle>
          <FAQText>• Выберите тип платформы слева (Астероид)</FAQText>
          <FAQText>
            • Кликните левой кнопкой мыши для размещения объекта
          </FAQText>
          <FAQText>
            • Используйте колесо мыши для изменения размера объекта
          </FAQText>
          <FAQText>
            • Перетаскивайте объекты, удерживая левую кнопку мыши
          </FAQText>
          <FAQText>• Нажмите правую кнопку мыши для сброса объекта</FAQText>
          <FAQText>• Нажмите Delete для удаления выбранного объекта</FAQText>
        </FAQSection>

        <FAQSection>
          <FAQTitle>Управление камерой:</FAQTitle>
          <FAQText>• Клавиша A - перемещение камеры влево</FAQText>
          <FAQText>• Клавиша D - перемещение камеры вправо</FAQText>
        </FAQSection>

        <FAQSection>
          <FAQTitle>Сохранение и загрузка:</FAQTitle>
          <FAQText>
            • Нажмите кнопку "Меню" для доступа к сохранению и загрузке уровней
          </FAQText>
          <FAQText>
            • Создавайте новые уровни, загружайте существующие или удаляйте их
          </FAQText>
        </FAQSection>
      </FAQContent>
    </ModalOverlay>
  );
};
