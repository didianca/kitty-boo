import { describe, it, expect } from "vitest";
import { applyMovement } from "../../physics/applyMovement";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CONTAINER_INSET,
  GRAVITY_ACCELERATION,
  FRICTION_FACTOR,
} from "../../constants";
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

describe("applyMovement", () => {
  it("applies gravity and friction to velocityY", () => {
    const items = [createItem()];
    const initialVY = items[0].velocityY;
    applyMovement(items);
    const expected = (initialVY + GRAVITY_ACCELERATION) * FRICTION_FACTOR;
    expect(items[0].velocityY).toBeCloseTo(expected, 10);
  });

  it("updates position from velocity", () => {
    const items = [createItem({ velocityX: 5, velocityY: 3 })];
    const initialX = items[0].positionX;
    const initialY = items[0].positionY;
    applyMovement(items);
    expect(items[0].positionX).toBe(initialX + 5);
    expect(items[0].positionY).toBeGreaterThan(initialY);
  });

  it("decrements mergeCooldown when present", () => {
    const items = [createItem({ mergeCooldown: 5 })];
    applyMovement(items);
    expect(items[0].mergeCooldown).toBe(4);
  });

  it("bounces off left wall", () => {
    const items = [
      createItem({
        positionX: CONTAINER_INSET + 10,
        radius: 14,
        velocityX: -5,
      }),
    ];
    applyMovement(items);
    expect(items[0].positionX).toBe(CONTAINER_INSET + 14);
    expect(items[0].velocityX).toBeGreaterThanOrEqual(0);
  });

  it("bounces off right wall", () => {
    const items = [
      createItem({
        positionX: CANVAS_WIDTH - CONTAINER_INSET - 10,
        radius: 14,
        velocityX: 5,
      }),
    ];
    applyMovement(items);
    expect(items[0].positionX).toBe(CANVAS_WIDTH - CONTAINER_INSET - 14);
    expect(items[0].velocityX).toBeLessThanOrEqual(0);
  });

  it("bounces off floor", () => {
    const items = [
      createItem({
        positionY: CANVAS_HEIGHT - CONTAINER_INSET - 10,
        radius: 14,
        velocityY: 10,
      }),
    ];
    applyMovement(items);
    expect(items[0].positionY).toBe(CANVAS_HEIGHT - CONTAINER_INSET - 14);
    expect(items[0].velocityY).toBeLessThanOrEqual(0);
  });
});
