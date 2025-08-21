import type { Item } from "./types";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  RADIUS_BY_LEVEL,
  GRAVITY,
  FLOOR_BOUNCE,
  WALL_BOUNCE,
  FRICTION,
} from "./constants";

export function physics(
  items: Item[],
  setScore: (fn: (score: number) => number) => void,
  setGameOver: (isGameOver: boolean) => void,
  gameOver: boolean,
  idRef: React.MutableRefObject<number>
): void {
  // Apply gravity and move
  for (const item of items) {
    item.vy += GRAVITY;
    item.x += item.vx;
    item.y += item.vy;
    item.vx *= FRICTION;
    item.vy *= FRICTION;

    // Walls
    if (item.x - item.r < 0) {
      item.x = item.r;
      item.vx = Math.abs(item.vx) * WALL_BOUNCE;
    } else if (item.x + item.r > CANVAS_WIDTH) {
      item.x = CANVAS_WIDTH - item.r;
      item.vx = -Math.abs(item.vx) * WALL_BOUNCE;
    }
    // Floor
    if (item.y + item.r > CANVAS_HEIGHT) {
      item.y = CANVAS_HEIGHT - item.r;
      item.vy = -Math.abs(item.vy) * FLOOR_BOUNCE;
      item.vx *= 0.98; // Dampen horizontal on floor contact
    }
  }

  // --- Merge: only merge pairs not blocked by a third item ---
  let merged = true;
  while (merged) {
    merged = false;
    let minDistanceSquared = Infinity;
    let mergePair: [number, number] | null = null;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const itemA = items[i];
        const itemB = items[j];
        if (itemA.level === itemB.level) {
          const deltaX = itemB.x - itemA.x;
          const deltaY = itemB.y - itemA.y;
          const minDistance = itemA.r + itemB.r;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;
          if (
            distanceSquared <= minDistance * minDistance &&
            distanceSquared < minDistanceSquared
          ) {
            // Check for a third item between itemA and itemB
            let blocked = false;
            for (let k = 0; k < items.length; k++) {
              if (k !== i && k !== j) {
                const itemC = items[k];
                const distCtoA2 = (itemC.x - itemA.x) ** 2 + (itemC.y - itemA.y) ** 2;
                const distCtoB2 = (itemC.x - itemB.x) ** 2 + (itemC.y - itemB.y) ** 2;
                if (
                  distCtoA2 < (itemC.r + itemA.r) ** 2 &&
                  distCtoB2 < (itemC.r + itemB.r) ** 2
                ) {
                  blocked = true;
                  break;
                }
              }
            }
            if (!blocked) {
              minDistanceSquared = distanceSquared;
              mergePair = [i, j];
            }
          }
        }
      }
    }
    if (mergePair) {
      const [indexA, indexB] = mergePair;
      const itemA = items[indexA];
      const itemB = items[indexB];
      const newLevel = itemA.level + 1;
      const mergedRadius =
        RADIUS_BY_LEVEL[Math.min(newLevel, RADIUS_BY_LEVEL.length - 1)];
      const mergedItem: Item = {
        id: idRef.current++,
        x: (itemA.x + itemB.x) / 2,
        y: (itemA.y + itemB.y) / 2,
        vx: (itemA.vx + itemB.vx) / 2,
        vy: (itemA.vy + itemB.vy) / 2,
        r: mergedRadius,
        level: newLevel,
      };
      items.splice(indexB, 1);
      items.splice(indexA, 1);
      items.push(mergedItem);
      setScore((score) => score + Math.pow(2, newLevel) * 10);
      merged = true;
    }
  }

  // --- Robust separation with stacking and rolling ---
  let separated = true;
  let separationIterations = 0;
  const SEPARATION_ITERATION_LIMIT = 1000;

  while (separated && separationIterations < SEPARATION_ITERATION_LIMIT) {
    separated = false;
    separationIterations++;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const itemA = items[i];
        const itemB = items[j];
        const deltaX = itemB.x - itemA.x;
        const deltaY = itemB.y - itemA.y;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;
        const minDistance = itemA.r + itemB.r;
        if (distanceSquared > 0 && distanceSquared < minDistance * minDistance) {
          const distance = Math.sqrt(distanceSquared);
          const normX = deltaX / distance;
          const normY = deltaY / distance;
          const overlap = minDistance - distance;
          // Push apart
          itemA.x -= normX * overlap * 0.5;
          itemA.y -= normY * overlap * 0.5;
          itemB.x += normX * overlap * 0.5;
          itemB.y += normY * overlap * 0.5;
          separated = true;

          // Stable stacking for different levels
          if (itemA.level !== itemB.level) {
            // If vertical overlap is significant, dampen vertical velocity for stacking
            if (Math.abs(itemA.y - itemB.y) > Math.abs(itemA.x - itemB.x)) {
              if (itemA.y > itemB.y) {
                itemA.vy = Math.min(itemA.vy, 0);
                itemB.vy = Math.max(itemB.vy, 0);
              } else {
                itemA.vy = Math.max(itemA.vy, 0);
                itemB.vy = Math.min(itemB.vy, 0);
              }
              // Optional: add a small horizontal nudge to simulate rolling
              const roll = 0.1 * (Math.random() - 0.5);
              itemA.vx += roll;
              itemB.vx -= roll;
            }
          }
        } else if (distanceSquared === 0) {
          // Items are exactly on top of each other; nudge them apart deterministically
          const angle = (Math.random() + i) * 2 * Math.PI;
          const nudge = minDistance * 0.5;
          itemA.x += Math.cos(angle) * nudge;
          itemA.y += Math.sin(angle) * nudge;
          itemB.x -= Math.cos(angle) * nudge;
          itemB.y -= Math.sin(angle) * nudge;
          // Give a small horizontal velocity to help separation
          itemA.vx += Math.cos(angle) * 0.5;
          itemB.vx -= Math.cos(angle) * 0.5;
          separated = true;
        }
      }
    }
  }
  if (separationIterations === SEPARATION_ITERATION_LIMIT) {
    // Optional: log a warning for debugging
    // console.warn("Separation loop hit iteration limit!");
  }

  // Game over if any item breaches top
  if (!gameOver) {
    for (const item of items) {
      if (item.y - item.r < 0) {
        setGameOver(true);
        break;
      }
    }
  }
}
