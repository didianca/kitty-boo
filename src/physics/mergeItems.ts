import type { Item } from "../types";
import { ITEM_RADIUS_BY_LEVEL } from "../constants";
import { playMergeSound } from "../utils/sounds"; // Add this import at the top

export function mergeItems(
  items: Item[],
  setScore: (fn: (score: number) => number) => void,
  idRef: React.RefObject<number>,
  gameOver: boolean // <-- add this parameter
): boolean {
  if (gameOver) return false;
  let merged = false;
  let minDistanceSquared = Infinity;
  let mergePair: [number, number] | null = null;
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const itemA = items[i];
      const itemB = items[j];
      if (
        itemA.level === itemB.level &&
        (!itemA.mergeCooldown || itemA.mergeCooldown === 0) &&
        (!itemB.mergeCooldown || itemB.mergeCooldown === 0)
      ) {
        const deltaX = itemB.positionX - itemA.positionX;
        const deltaY = itemB.positionY - itemA.positionY;
        const minDistance = itemA.radius + itemB.radius;
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
              const distCtoA2 = (itemC.positionX - itemA.positionX) ** 2 + (itemC.positionY - itemA.positionY) ** 2;
              const distCtoB2 = (itemC.positionX - itemB.positionX) ** 2 + (itemC.positionY - itemB.positionY) ** 2;
              if (
                distCtoA2 < (itemC.radius + itemA.radius) ** 2 &&
                distCtoB2 < (itemC.radius + itemB.radius) ** 2
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
      ITEM_RADIUS_BY_LEVEL[Math.min(newLevel, ITEM_RADIUS_BY_LEVEL.length - 1)];
    const mergedItem: Item = {
      id: idRef.current++,
      positionX: (itemA.positionX + itemB.positionX) / 2,
      positionY: (itemA.positionY + itemB.positionY) / 2,
      velocityX: (itemA.velocityX + itemB.velocityX) / 2,
      velocityY: (itemA.velocityY + itemB.velocityY) / 2,
      radius: mergedRadius,
      level: newLevel,
      mergeCooldown: 20,
    };
    items.splice(indexB, 1);
    items.splice(indexA, 1);
    items.push(mergedItem);
    setScore((score) => score + Math.pow(2, newLevel) * 10);
    playMergeSound(); // <-- play sound after merging
    merged = true;
  }
  return merged;
}