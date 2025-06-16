import { getExperienceToNextLevel } from "../utils/player";
import { AimLine } from "./AimLine";

export class PlayerProgress {
  private level: number = 1;
  private experience: number = 0;
  private collectedItems: number = 0;
  private readonly BASE_SIZE: number = 100;
  private aimLine: AimLine | null = null;

  constructor(aimLine?: AimLine) {
    this.aimLine = aimLine || null;
  }

  public addExperience(amount: number): void {
    this.experience += amount;
    this.collectedItems++;
  }

  private resetExperience(): void {
    this.experience = 0;
  }

  public handleLevelUp(playerLvlUpper: () => void): boolean {
    const experienceToNextLevel = getExperienceToNextLevel(this.level);
    if (this.experience >= experienceToNextLevel && this.level < 2) {
      this.level++;
      this.resetExperience();
      playerLvlUpper();
      if (this.aimLine) {
        this.aimLine.increaseAimLine();
      }
      return true;
    }
    return false;
  }

  public getLevel(): number {
    return this.level;
  }

  public getExperience(): number {
    if (this.experience > 9) {
      return 9;
    }
    return this.experience;
  }

  public getCollectedItems(): number {
    return this.collectedItems;
  }

  public getNextSize(): number {
    return Math.floor(this.BASE_SIZE * (1 + this.level * 0.1));
  }

  public getSizeMultiplier(): number {
    if (this.level === 1) {
      return 1;
    }
    return 1.5 - (this.level - 1) * 0.1;
  }
}
