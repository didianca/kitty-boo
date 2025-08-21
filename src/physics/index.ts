import type { Item } from "../types";
import { applyMovement } from "./applyMovement";
import { mergeItems } from "./mergeItems";
import { separateItems } from "./separateItems";
import { checkGameOver } from "./checkGameOver";

export function physics(
  items: Item[],
  setScore: (fn: (score: number) => number) => void,
  setGameOver: (isGameOver: boolean) => void,
  gameOver: boolean,
  idRef: React.RefObject<number>
): void {
  if (gameOver) return;

  applyMovement(items);

  // Merge loop
  while (mergeItems(items, setScore, idRef, gameOver)) {
    // Continue merging items until no more merges are possible
  }

  separateItems(items);

  checkGameOver(items, setGameOver, gameOver);
}