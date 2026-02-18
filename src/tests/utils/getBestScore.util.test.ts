import { describe, it, expect, beforeEach } from "vitest";
import { getBestScore } from "../../utils/getBestScore.util";
import { addScoreToLeaderboard } from "../../utils/leaderboard.util";

describe("getBestScore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns 0 when leaderboard is empty", () => {
    expect(getBestScore()).toBe(0);
  });

  it("returns highest score from leaderboard", () => {
    addScoreToLeaderboard(50);
    addScoreToLeaderboard(200);
    addScoreToLeaderboard(100);
    expect(getBestScore()).toBe(200);
  });

  it("returns 0 for invalid JSON", () => {
    localStorage.setItem("kitty-boo-leaderboard", "invalid");
    expect(getBestScore()).toBe(0);
  });
});
