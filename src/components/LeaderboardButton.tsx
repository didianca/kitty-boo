import { COLORS } from "../maps/colors.map";

const BASE_URL = import.meta.env.BASE_URL;

type LeaderboardButtonProps = {
  onClick: () => void;
};

export function LeaderboardButton({ onClick }: LeaderboardButtonProps) {
  return (
    <button
      id="leaderboard-button"
      className="leaderboard-button"
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
        src={`${BASE_URL}trophy.png`}
        alt="Leaderboard"
        style={{
          display: "block",
          width: "clamp(19px, 1.9vw, 24px)",
          height: "clamp(19px, 1.9vw, 24px)",
        }}
        draggable={false}
      />
    </button>
  );
}