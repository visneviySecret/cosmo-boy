import React from "react";
import {
  Container,
  SelectWrapper,
  IconWrapper,
  Selector,
} from "./PlatformTypeSelector.style";
import { GroundIcon } from "./GroundIcon";

export const PlatformType = {
  Asteroid: "asteroid",
} as const;

type PlatformType = (typeof PlatformType)[keyof typeof PlatformType];

interface PlatformTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PlatformTypeSelector: React.FC<PlatformTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <Container>
      <SelectWrapper>
        <IconWrapper>{GroundIcon}</IconWrapper>
        <Selector value={value} onChange={(e) => onChange(e.target.value)}>
          <option value={PlatformType.Asteroid}>Астероид</option>
        </Selector>
      </SelectWrapper>
    </Container>
  );
};

export default PlatformTypeSelector;
