export class PlayerProgress {
  private level: number = 1;
  private experience: number = 0;
  private experienceToNextLevel: number = 100;
  private collectedItems: number = 0;

  constructor() {
    this.calculateNextLevelRequirement();
  }

  public addExperience(amount: number): void {
    this.experience += amount;
    this.collectedItems++;

    while (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
    }
  }

  private levelUp(): void {
    this.level++;
    this.experience -= this.experienceToNextLevel;
    this.calculateNextLevelRequirement();
  }

  private calculateNextLevelRequirement(): void {
    this.experienceToNextLevel = Math.floor(
      100 * Math.pow(1.5, this.level - 1)
    );
  }

  public getLevel(): number {
    return this.level;
  }

  public getExperience(): number {
    return this.experience;
  }

  public getExperienceToNextLevel(): number {
    return this.experienceToNextLevel;
  }

  public getCollectedItems(): number {
    return this.collectedItems;
  }
}
