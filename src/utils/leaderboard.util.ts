const LEADERBOARD_KEY = "kitty-boo-leaderboard";

export type LeaderboardEntry = {
  score: number;
  date: string; // ISO string
};

export function getLeaderboard(): LeaderboardEntry[] {
  const raw = localStorage.getItem(LEADERBOARD_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function addScoreToLeaderboard(score: number) {
  const leaderboard = getLeaderboard();
  leaderboard.push({ score, date: new Date().toISOString() });
  leaderboard.sort((a, b) => b.score - a.score);
  const top10 = leaderboard.slice(0, 10);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top10));
}