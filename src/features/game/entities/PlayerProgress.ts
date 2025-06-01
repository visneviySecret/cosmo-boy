export class PlayerProgress {
  private level: number = 1;
  private experience: number = 0;
  private collectedItems: number = 0;
  private readonly BASE_SIZE: number = 100;

  public addExperience(amount: number): void {
    this.experience += amount;
    this.collectedItems++;
  }

  private resetExperience(): void {
    this.experience = 0;
  }

  public levelUp(): void {
    this.level++;
    this.resetExperience();
  }

  public checkLevelUp(currentSize: number): boolean {
    const maxRadius = currentSize / 2;
    const currentRadius = Math.min(maxRadius, this.experience * 10);

    if (currentRadius >= maxRadius) {
      this.levelUp();
      return true;
    }
    return false;
  }

  public getLevel(): number {
    return this.level;
  }

  public getExperience(): number {
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
