import { Player } from "../entities/Player";
import { Food } from "../entities/Food";
import Phaser from "phaser";

export function handleFoodCollision(
  player: Player,
  food: Food,
  scoreText: Phaser.GameObjects.Text
) {
  player.collectFood(food);
  food.collect();
  scoreText.setText(`Собрано: ${player.getCollectedItems()}`);
}

export function createFoodCollision(
  scene: Phaser.Scene,
  player: Player,
  foodGroup: Phaser.Physics.Arcade.Group
) {
  scene.physics.add.overlap(
    player,
    foodGroup,
    (obj1: unknown, obj2: unknown) => {
      const playerObj = obj1 as Player;
      const foodObj = obj2 as Food;
      handleFoodCollision(playerObj, foodObj, (scene as any).scoreText);
    },
    undefined,
    scene
  );
}
