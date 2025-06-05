import styled from "styled-components";

export const EditorContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

export const EditorPanel = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
`;

export const EditorButton = styled.button`
  color: #fff;
  background: #4caf50;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
  &:last-child {
    background: #2196f3;
  }
  &:hover {
    filter: brightness(1.1);
  }
`;

export const EditorCanvas = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
`;
