import styled from "styled-components";

const ModalOverlayStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 400px;
`;
const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

export const ModalOverlay = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlayStyle onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Выбор уровня</Title>

        {children}
      </ModalContent>
    </ModalOverlayStyle>
  );
};
