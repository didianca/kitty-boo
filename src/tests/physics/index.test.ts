import { describe, it, expect, vi, beforeEach } from "vitest";
import { physics } from "../../physics/index";
import type { Item } from "../../types";

const createItem = (overrides: Partial<Item> = {}): Item => ({
  id: 1,
  positionX: 180,
  positionY: 100,
  velocityX: 0,
  velocityY: 0,
  radius: 14,
  level: 0,
  ...overrides,
});

describe("physics", () => {
  const setScore = vi.fn((fn: (s: number) => number) => fn(0));
  const setGameOver = vi.fn();
  const idRef = { current: 1 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing when gameOver is true", () => {
    const items = [createItem()];
    physics(items, setScore, setGameOver, true, idRef);
    expect(items[0].positionY).toBe(100);
  });

  it("applies movement when gameOver is false", () => {
    const items = [createItem()];
    physics(items, setScore, setGameOver, false, idRef);
    expect(items[0].positionY).toBeGreaterThan(100);
  });

  it("can process multiple items", () => {
    const items = [
      createItem({ id: 1, positionY: 200 }),
      createItem({ id: 2, positionY: 300 }),
    ];
    physics(items, setScore, setGameOver, false, idRef);
    expect(items).toHaveLength(2);
  });
});
