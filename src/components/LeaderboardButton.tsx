import { COLORS } from "../maps/colors.map";

type LeaderboardButtonProps = {
  onClick: () => void;
};

export function LeaderboardButton({ onClick }: LeaderboardButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.maize,
        border: `2px solid ${COLORS.purple}`,
        borderRadius: "50%",
        width: "clamp(32px, 8vw, 40px)",
        height: "clamp(32px, 8vw, 40px)",
        fontSize: "clamp(16px, 2vw, 20px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
      }}
      aria-label="Show leaderboard"
    >
      <img
        src="../public/trophy.png"
        alt="Leaderboard"
        style={{ display: "block", width: "clamp(19px, 1.9vw, 24px)", height: "clamp(19px, 1.9vw, 24px)" }}
        draggable={false}
      />
    </button>
  );
}