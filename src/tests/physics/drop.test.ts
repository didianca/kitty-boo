import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDropCooldownMs, drop } from "../../physics/drop";
import { GRAVITY_ACCELERATION } from "../../constants";
import type { Item } from "../../types";

describe("getDropCooldownMs", () => {
  it("returns positive milliseconds for any radius", () => {
    expect(getDropCooldownMs(14)).toBeGreaterThan(0);
    expect(getDropCooldownMs(170)).toBeGreaterThan(0);
  });

  it("returns larger cooldown for larger radius", () => {
    const small = getDropCooldownMs(14);
    const large = getDropCooldownMs(56);
    expect(large).toBeGreaterThan(small);
  });

  it("uses correct kinematic formula: time = sqrt(2*distance/acceleration)", () => {
    const radius = 14;
    const result = getDropCooldownMs(radius);
    const distance = radius * 4;
    const frames = Math.sqrt((2 * distance) / GRAVITY_ACCELERATION);
    const expectedMs = (frames / 60) * 1000;
    expect(result).toBeCloseTo(expectedMs);
  });
});

describe("drop", () => {
  const createRefs = () => ({
    itemsRef: { current: [] as Item[] },
    idRef: { current: 1 },
    aimXRef: { current: 180 },
    setNextLevel: vi.fn(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing when gameOver is true", () => {
    const refs = createRefs();
    drop(refs.itemsRef, refs.idRef, 0, refs.setNextLevel, refs.aimXRef, true);
    expect(refs.itemsRef.current).toHaveLength(0);
    expect(refs.setNextLevel).not.toHaveBeenCalled();
  });

  it("adds an item when gameOver is false", () => {
    const refs = createRefs();
    drop(refs.itemsRef, refs.idRef, 0, refs.setNextLevel, refs.aimXRef, false);
    expect(refs.itemsRef.current).toHaveLength(1);
    expect(refs.itemsRef.current[0]).toMatchObject({
      velocityX: 0,
      velocityY: 0,
      level: 0,
      radius: 14,
    });
    expect(refs.itemsRef.current[0].positionX).toBe(180);
  });

  it("increments item id", () => {
    const refs = createRefs();
    drop(refs.itemsRef, refs.idRef, 0, refs.setNextLevel, refs.aimXRef, false);
    drop(refs.itemsRef, refs.idRef, 0, refs.setNextLevel, refs.aimXRef, false);
    expect(refs.itemsRef.current[0].id).toBe(1);
    expect(refs.itemsRef.current[1].id).toBe(2);
  });

  it("clamps positionX within bounds", () => {
    const refs = createRefs();
    refs.aimXRef.current = 10;
    drop(refs.itemsRef, refs.idRef, 0, refs.setNextLevel, refs.aimXRef, false);
    expect(refs.itemsRef.current[0].positionX).toBeGreaterThanOrEqual(22);
  });

  it("calls setNextLevel with new level (0, 1, or 2)", () => {
    const refs = createRefs();
    drop(refs.itemsRef, refs.idRef, 0, refs.setNextLevel, refs.aimXRef, false);
    expect(refs.setNextLevel).toHaveBeenCalledWith(expect.any(Number));
    const arg = refs.setNextLevel.mock.calls[0][0];
    expect([0, 1, 2]).toContain(arg);
  });
});
