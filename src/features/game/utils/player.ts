export const getCurrentTexture = (level: number): string => {
  switch (level) {
    case 1:
      return "player_phase_1";
    case 2:
      return "player_phase_2";
    default:
      return "player_phase_2";
  }
};

export const calculateTextureScale = (level: number): number => {
  switch (level) {
    case 1:
      return 0.9;
    case 2:
      return 0.7;
    case 3:
      return 0.5;
    default:
      return 0.4;
  }
};

export const textureResize = (level: number): number => {
  switch (level) {
    case 1:
      return 220 / 3;
    case 2:
      return 232 / 3;
    case 4:
      return 606 / 3;
    default:
      return 400;
  }
};

export const getExperienceToNextLevel = (level: number): number => {
  switch (level) {
    case 1:
    case 2:
      return 9;
    default:
      return 9;
  }
};

export const getOffset = (level: number, size: number): [number, number] => {
  switch (level) {
    case 1:
      return [size, size * 2];
    default:
      return [size, size];
  }
};
