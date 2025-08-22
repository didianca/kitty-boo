import type { Item } from "../types";
import { CANVAS_WIDTH, CONTAINER_INSET, ITEM_RADIUS_BY_LEVEL, PREVIEW_Y } from "../constants";

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
  const positionY = PREVIEW_Y + radius; // Use the preview's Y position exactly
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