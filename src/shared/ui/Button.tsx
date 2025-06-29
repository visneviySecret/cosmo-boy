import React from "react";
import styled from "styled-components";

const DEFAULT_COLOR = "#fff";
const PRIMARY_COLOR = "#4caf50";
const SECONDARY_COLOR = "#2196f3";
const DANGER_COLOR = "#f44336";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  $variant?: "default" | "primary" | "secondary" | "danger";
}

export const Button = ({
  onClick,
  children,
  $variant = "default",
  ...props
}: ButtonProps) => {
  return (
    <ButtonStyle onClick={onClick} $variant={$variant} {...props}>
      {children}
    </ButtonStyle>
  );
};

const getButtonColor = (variant: ButtonProps["$variant"]) => {
  switch (variant) {
    case "primary":
      return PRIMARY_COLOR;
    case "secondary":
      return SECONDARY_COLOR;
    case "danger":
      return DANGER_COLOR;
    default:
      return DEFAULT_COLOR;
  }
};

const getButtonTextColor = (variant: ButtonProps["$variant"]) => {
  switch (variant) {
    case "primary":
    case "secondary":
    case "danger":
      return "#fff";
    default:
      return "#000";
  }
};

const ButtonStyle = styled.button<ButtonProps>`
  color: ${({ $variant }) => getButtonTextColor($variant)};
  background: ${({ $variant }) => getButtonColor($variant)};
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  /* padding: 0.5rem; */
  border: none;

  &:hover {
    filter: brightness(1.1);
  }
`;
