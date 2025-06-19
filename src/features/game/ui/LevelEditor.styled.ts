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
  right: 316px;
  display: flex;
  gap: 1rem;
`;

export const EditorCanvas = styled.div``;

export const EditorToolsWrapper = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;
