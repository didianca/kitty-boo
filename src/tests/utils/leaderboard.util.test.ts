import { describe, it, expect, beforeEach } from "vitest";
import {
  getLeaderboard,
  addScoreToLeaderboard,
  type LeaderboardEntry,
} from "../../utils/leaderboard.util";

const STORAGE_KEY = "kitty-boo-leaderboard";

describe("leaderboard.util", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getLeaderboard", () => {
    it("returns empty array when localStorage is empty", () => {
      expect(getLeaderboard()).toEqual([]);
    });

    it("returns parsed entries from localStorage", () => {
      const entries: LeaderboardEntry[] = [
        { score: 100, date: "2024-01-01T00:00:00.000Z" },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      expect(getLeaderboard()).toEqual(entries);
    });

    it("returns empty array for invalid JSON", () => {
      localStorage.setItem(STORAGE_KEY, "invalid json");
      expect(getLeaderboard()).toEqual([]);
    });
  });

  describe("addScoreToLeaderboard", () => {
    it("adds score to empty leaderboard", () => {
      addScoreToLeaderboard(50);
      const result = getLeaderboard();
      expect(result).toHaveLength(1);
      expect(result[0].score).toBe(50);
      expect(result[0].date).toBeDefined();
    });

    it("sorts by score descending", () => {
      addScoreToLeaderboard(30);
      addScoreToLeaderboard(100);
      addScoreToLeaderboard(60);
      const result = getLeaderboard();
      expect(result[0].score).toBe(100);
      expect(result[1].score).toBe(60);
      expect(result[2].score).toBe(30);
    });

    it("keeps only top 10", () => {
      for (let i = 0; i < 15; i++) {
        addScoreToLeaderboard(i * 10);
      }
      const result = getLeaderboard();
      expect(result).toHaveLength(10);
      expect(result[0].score).toBe(140);
    });
  });
});
