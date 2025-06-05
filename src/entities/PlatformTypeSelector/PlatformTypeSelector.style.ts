import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const IconWrapper = styled.span`
  position: absolute;
  left: 1.5em;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
`;

export const PlatformIcon = styled.svg`
  display: block;
`;

export const Selector = styled.select`
  font-size: 1.2rem;
  border-radius: 8px;
  padding: 1em 0.5rem 1em 3em;
  /* left padding увеличен для иконки */
`;
