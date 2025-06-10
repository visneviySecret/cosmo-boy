import styled from "styled-components";

export const LevelList = styled.div`
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
`;

export const LevelItem = styled.div<{ name: string; id: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const RadioButton = styled.input``;

export const LevelItemLabel = styled.label``;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;
