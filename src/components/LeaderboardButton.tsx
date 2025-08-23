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
        width: 40,
        height: 40,
        fontSize: 20,
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
        width={24}
        height={24}
        style={{ display: "block" }}
        draggable={false}
      />
    </button>
  );
}