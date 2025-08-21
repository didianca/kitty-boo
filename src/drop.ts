import type { Item } from "./types";
import { RADIUS_BY_LEVEL, CANVAS_WIDTH } from "./constants";

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
  const radius = RADIUS_BY_LEVEL[Math.min(level, RADIUS_BY_LEVEL.length - 1)];
  const x = Math.max(radius + 2, Math.min(CANVAS_WIDTH - radius - 2, aimXRef.current));
  const y = radius + 4;
  itemsRef.current.push({
    id: idRef.current++,
    x,
    y,
    vx: 0,
    vy: 0,
    r: radius,
    level,
  });

  // Choose a new next piece (basic: 0..2 more likely)
  const roll = Math.random();
  setNextLevel(roll < 0.7 ? 0 : roll < 0.9 ? 1 : 2);
}