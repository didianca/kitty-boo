import { describe, it, expect } from "vitest";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ITEM_RADIUS_BY_LEVEL,
  GRAVITY_ACCELERATION,
  CONTAINER_INSET,
  PREVIEW_Y,
} from "../constants";

describe("constants", () => {
  it("CANVAS_WIDTH is positive", () => {
    expect(CANVAS_WIDTH).toBeGreaterThan(0);
  });

  it("CANVAS_HEIGHT is greater than CANVAS_WIDTH (portrait)", () => {
    expect(CANVAS_HEIGHT).toBeGreaterThan(CANVAS_WIDTH);
  });

  it("ITEM_RADIUS_BY_LEVEL has 10 levels", () => {
    expect(ITEM_RADIUS_BY_LEVEL).toHaveLength(10);
  });

  it("ITEM_RADIUS_BY_LEVEL is strictly increasing", () => {
    for (let i = 1; i < ITEM_RADIUS_BY_LEVEL.length; i++) {
      expect(ITEM_RADIUS_BY_LEVEL[i]).toBeGreaterThan(ITEM_RADIUS_BY_LEVEL[i - 1]);
    }
  });

  it("GRAVITY_ACCELERATION is positive", () => {
    expect(GRAVITY_ACCELERATION).toBeGreaterThan(0);
  });

  it("CONTAINER_INSET is positive", () => {
    expect(CONTAINER_INSET).toBeGreaterThan(0);
  });

  it("PREVIEW_Y is within canvas", () => {
    expect(PREVIEW_Y).toBeGreaterThan(0);
    expect(PREVIEW_Y).toBeLessThan(CANVAS_HEIGHT);
  });
});
