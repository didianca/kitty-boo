import type { Item } from "./types";
import { CANVAS_HEIGHT, CANVAS_WIDTH, CONTAINER_INSET, ITEM_RADIUS_BY_LEVEL } from "./constants";

// Calculate the game over line Y (should match your draw/checkGameOver logic)
const GAME_OVER_LINE_Y = CONTAINER_INSET + (CANVAS_HEIGHT - 2 * CONTAINER_INSET) * 0.2;

export function drop(
  itemsRef: React.RefObject<Item[]>,
  idRef: React.RefObject<number>,
  nextLevel: number,
  setNextLevel: React.Dispatch<React.SetStateAction<number>>,
  aimXRef: React.RefObject<number>,
  gameOver: boolean
) {
  if (gameOver) return;
  const level = nextLevel;
  const radius = ITEM_RADIUS_BY_LEVEL[Math.min(level, ITEM_RADIUS_BY_LEVEL.length - 1)];
  const positionX = Math.max(
    CONTAINER_INSET + radius,
    Math.min(CANVAS_WIDTH - CONTAINER_INSET - radius, aimXRef.current)
  );
  const positionY = GAME_OVER_LINE_Y + radius + 16; // 16px buffer below the line
  itemsRef.current.push({
    id: idRef.current++,
    positionX,
    positionY,
    velocityX: 0,
    velocityY: 0,
    radius,
    level,
  });

  // Choose a new next piece (basic: 0..2 more likely)
  const roll = Math.random();
  setNextLevel(roll < 0.7 ? 0 : roll < 0.9 ? 1 : 2);
}