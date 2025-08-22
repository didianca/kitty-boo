import { CANVAS_WIDTH, CANVAS_HEIGHT, CONTAINER_INSET } from "../constants";
import type { Item } from "../types";
import { playGameOverSound } from "../utils/sounds.util";

export function checkGameOver(
  items: Item[],
  setGameOver: (isGameOver: boolean) => void,
  gameOver: boolean
) {
  if (gameOver) return;

  const GAME_OVER_LINE_Y = CONTAINER_INSET + (CANVAS_HEIGHT - 2 * CONTAINER_INSET) * 0.2;

  // Only consider items that are settled (velocityY near zero)
  const settledItems = items.filter(
    (item) => Math.abs(item.velocityY) < 0.1
  );

  // 1. If any settled item is 80% or more above the game over line, trigger game over
  const overEightyPercent = settledItems.some(
    (item) =>
      item.positionY + item.radius < GAME_OVER_LINE_Y - 0.6 * item.radius // 80% above
  );
  if (overEightyPercent) {
    setGameOver(true);
    playGameOverSound();
    return;
  }

  // 2. Only consider settled items under the game over line for row check
  const blockingItems = settledItems.filter(
    (item) => item.positionY - item.radius <= GAME_OVER_LINE_Y
  );

  if (blockingItems.length === 0) return;

  // Sort by left edge
  const sorted = blockingItems
    .map((item) => ({
      left: item.positionX - item.radius,
      right: item.positionX + item.radius,
    }))
    .sort((a, b) => a.left - b.left);

  // Merge intervals and check for gaps
  let currentRight = 0;
  for (const { left, right } of sorted) {
    if (left > currentRight + 2) {
      // Found a gap
      return;
    }
    currentRight = Math.max(currentRight, right);
  }

  // If the rightmost edge covers the canvas width, it's game over
  if (currentRight >= CANVAS_WIDTH - 2) {
    setGameOver(true);
    playGameOverSound();
  }
}