export function getBestScore(): number {
  const raw = localStorage.getItem("kitty-boo-leaderboard");
  if (!raw) return 0;
  try {
    const leaderboard = JSON.parse(raw) as { score: number }[];
    return leaderboard.length ? leaderboard[0].score : 0;
  } catch {
    return 0;
  }
}