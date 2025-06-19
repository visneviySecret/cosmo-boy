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
  left: 1em;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  height: 1.5rem;
  z-index: 2;
`;

export const Selector = styled.div`
  font-size: 1rem;
  border-radius: 8px;
  padding: 0.5em 1.5em 0.5em 2em;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  min-width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:after {
    content: "";
    position: absolute;
    right: 1em;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #666;
  }
`;

export const OptionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

export const Option = styled.div`
  padding: 1em 2.5em 1em 3em;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;
