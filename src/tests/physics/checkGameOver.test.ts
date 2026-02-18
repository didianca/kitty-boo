import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkGameOver } from "../../physics/checkGameOver";
import { CANVAS_WIDTH, CANVAS_HEIGHT, CONTAINER_INSET } from "../../constants";
import type { Item } from "../../types";

const GAME_OVER_LINE_Y =
  CONTAINER_INSET + (CANVAS_HEIGHT - 2 * CONTAINER_INSET) * 0.2;

const createItem = (x: number, y: number, radius: number): Item => ({
  id: 1,
  positionX: x,
  positionY: y,
  velocityX: 0,
  velocityY: 0,
  radius,
  level: 0,
});

describe("checkGameOver", () => {
  const setGameOver = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing when gameOver is already true", () => {
    const items = [createItem(100, GAME_OVER_LINE_Y - 50, 14)];
    items[0].velocityY = 0;
    checkGameOver(items, setGameOver, true);
    expect(setGameOver).not.toHaveBeenCalled();
  });

  it("triggers game over when settled item is 80% above game over line", () => {
    const items = [
      createItem(180, GAME_OVER_LINE_Y - 50, 14),
    ];
    items[0].velocityY = 0;
    checkGameOver(items, setGameOver, false);
    expect(setGameOver).toHaveBeenCalledWith(true);
  });

  it("does not trigger when item has high velocity (not settled)", () => {
    const items = [createItem(180, GAME_OVER_LINE_Y - 50, 14)];
    items[0].velocityY = 5;
    checkGameOver(items, setGameOver, false);
    expect(setGameOver).not.toHaveBeenCalled();
  });

  it("triggers game over when line is fully blocked", () => {
    // One wide item spanning the game-over line
    const radius = 180;
    const items = [createItem(180, GAME_OVER_LINE_Y, radius)];
    items[0].velocityY = 0;
    checkGameOver(items, setGameOver, false);
    expect(setGameOver).toHaveBeenCalledWith(true);
  });
});
