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
  padding: 1em 2.5em 1em 3em;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1em center;
  background-size: 1em;
`;
