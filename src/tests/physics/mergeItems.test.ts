import { describe, it, expect, vi, beforeEach } from "vitest";
import { mergeItems } from "../../physics/mergeItems";
import type { Item } from "../../types";

const createItem = (
  id: number,
  x: number,
  y: number,
  level: number,
  radius: number
): Item => ({
  id,
  positionX: x,
  positionY: y,
  velocityX: 0,
  velocityY: 0,
  radius,
  level,
});

describe("mergeItems", () => {
  const setScore = vi.fn((fn: (s: number) => number) => fn(0));
  const idRef = { current: 100 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns false when gameOver is true", () => {
    const items = [
      createItem(1, 50, 100, 0, 14),
      createItem(2, 65, 100, 0, 14),
    ];
    const result = mergeItems(items, setScore, idRef, true);
    expect(result).toBe(false);
    expect(items).toHaveLength(2);
  });

  it("merges two same-level items that overlap", () => {
    const items = [
      createItem(1, 50, 100, 0, 14),
      createItem(2, 65, 100, 0, 14),
    ];
    const result = mergeItems(items, setScore, idRef, false);
    expect(result).toBe(true);
    expect(items).toHaveLength(1);
    expect(items[0].level).toBe(1);
    expect(items[0].radius).toBe(18);
  });

  it("does not merge items of different levels", () => {
    const items = [
      createItem(1, 50, 100, 0, 14),
      createItem(2, 65, 100, 1, 18),
    ];
    const result = mergeItems(items, setScore, idRef, false);
    expect(result).toBe(false);
    expect(items).toHaveLength(2);
  });

  it("does not merge items with mergeCooldown", () => {
    const items = [
      createItem(1, 50, 100, 0, 14),
      createItem(2, 65, 100, 0, 14),
    ];
    items[0].mergeCooldown = 5;
    const result = mergeItems(items, setScore, idRef, false);
    expect(result).toBe(false);
  });

  it("calls setScore with increment", () => {
    const items = [
      createItem(1, 50, 100, 0, 14),
      createItem(2, 65, 100, 0, 14),
    ];
    mergeItems(items, setScore, idRef, false);
    expect(setScore).toHaveBeenCalled();
  });
});
