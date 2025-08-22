import type { Item } from "../types";
import { CANVAS_HEIGHT, CONTAINER_INSET } from "../constants";
import { playGameOverSound } from "../utils/sounds";

const GAME_OVER_LINE_Y = CONTAINER_INSET + (CANVAS_HEIGHT - 2 * CONTAINER_INSET) * 0.2;

export function checkGameOver(
  items: Item[],
  setGameOver: (isGameOver: boolean) => void,
  gameOver: boolean
) {
  if (!gameOver) {
    for (const item of items) {
      // Allow the item to pass the green line by 50% of its radius before game over
      if (item.positionY - item.radius * 0.5 < GAME_OVER_LINE_Y) {
        setGameOver(true);
        playGameOverSound(); // Play sound on game over
        break;
      }
    }
  }
}