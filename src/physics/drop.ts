import type { Item } from "../types";
import { CANVAS_WIDTH, CONTAINER_INSET, ITEM_RADIUS_BY_LEVEL, PREVIEW_Y, GRAVITY_ACCELERATION } from "../constants";

// Calculate cooldown time (in milliseconds) for an item to travel 2x its diameter
export function getDropCooldownMs(itemRadius: number): number {
  const FRAME_RATE = 60; // Assuming 60fps animation loop
  const distance = itemRadius * 4; // 2x diameter = 2 * (2 * radius) = 4 * radius
  
  // Using kinematic equation: distance = 0.5 * acceleration * time²
  // Solving for time: time = sqrt(2 * distance / acceleration)
  const frames = Math.sqrt(2 * distance / GRAVITY_ACCELERATION);
  const ms = (frames / FRAME_RATE) * 1000;
  
  return ms;
}

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