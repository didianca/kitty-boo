import type { Item } from "./types";
import { ITEM_RADIUS_BY_LEVEL, CANVAS_WIDTH, CONTAINER_INSET, CANVAS_HEIGHT } from "./constants";

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
  const positionY = GAME_OVER_LINE_Y + radius + 8; // Drop well below the game over line
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