import { describe, it, expect } from "vitest";
import { separateItems } from "../../physics/separateItems";
import type { Item } from "../../types";

const createItem = (x: number, y: number, radius: number): Item => ({
  id: 1,
  positionX: x,
  positionY: y,
  velocityX: 0,
  velocityY: 0,
  radius,
  level: 0,
});

describe("separateItems", () => {
  it("separates overlapping items", () => {
    const items = [
      createItem(50, 100, 14),
      createItem(55, 100, 14),
    ];
    const initialDist =
      Math.hypot(
        items[1].positionX - items[0].positionX,
        items[1].positionY - items[0].positionY
      );
    separateItems(items);
    const finalDist = Math.hypot(
      items[1].positionX - items[0].positionX,
      items[1].positionY - items[0].positionY
    );
    expect(finalDist).toBeGreaterThanOrEqual(28);
    expect(finalDist).toBeGreaterThan(initialDist);
  });

  it("handles non-overlapping items without changing them", () => {
    const items = [
      createItem(50, 100, 14),
      createItem(100, 100, 14),
    ];
    const [a, b] = items.map((i) => ({ ...i }));
    separateItems(items);
    expect(items[0].positionX).toBe(a.positionX);
    expect(items[1].positionX).toBe(b.positionX);
  });

  it("does not throw for empty array", () => {
    expect(() => separateItems([])).not.toThrow();
  });

  it("does not throw for single item", () => {
    expect(() => separateItems([createItem(50, 100, 14)])).not.toThrow();
  });
});
