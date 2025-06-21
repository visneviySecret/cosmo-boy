export const getCurrentTexture = (level: number): string => {
  const phase = level > frameSizes.length ? frameSizes.length : level;
  return `player_phase_${phase}`;
};

export const textureResize = (
  level: number
): { width: number; height: number } => {
  const frameSize = getFrameSize(level);
  switch (level) {
    case 1:
    case 2:
      return {
        width: frameSize.frameWidth / 1.6,
        height: frameSize.frameHeight / 1.3,
      };
    case 3:
      return {
        width: frameSize.frameWidth / 1.3,
        height: frameSize.frameHeight / 1.2,
      };
    case 4:
      return {
        width: frameSize.frameWidth / 1.6,
        height: frameSize.frameHeight / 1.1,
      };
    case 5:
      return {
        width: frameSize.frameWidth / 1.6,
        height: frameSize.frameHeight / 1.1,
      };
    case 6:
      return {
        width: frameSize.frameWidth / 2,
        height: frameSize.frameHeight + 10,
      };
    default:
      return { width: frameSize.frameWidth, height: frameSize.frameHeight };
  }
};

export const getExperienceToNextLevel = (): number => {
  return 10;
};

export const getOffset = (level: number, size: number): [number, number] => {
  switch (level) {
    case 1:
      return [size / 3, size / 5];
    case 2:
      return [size / 4, size / 10];
    case 3:
      return [size / 6, size / 10];
    case 4:
      return [size / 8, size / 10];
    case 5:
      return [size / 10, size / 10];
    case 6:
      return [-size / 100 + size / 2, -size / 100 + 10];
    default:
      return [size, size];
  }
};

export const getFrameSize = (
  level: number
): { frameWidth: number; frameHeight: number } => {
  return frameSizes[level - 1];
};

export const frameSizes = [
  {
    frameWidth: 182,
    frameHeight: 220,
  },
  {
    frameWidth: 258,
    frameHeight: 232,
  },
  {
    frameWidth: 186,
    frameHeight: 282,
  },
  {
    frameWidth: 184,
    frameHeight: 312,
  },
  {
    frameWidth: 249,
    frameHeight: 352,
  },
  {
    frameWidth: 600,
    frameHeight: 286,
  },
];
