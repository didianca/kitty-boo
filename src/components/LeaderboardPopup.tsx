import { COLORS } from "../maps/colors.map";
import { Leaderboard } from "./Leaderboard";

type LeaderboardPopupProps = {
  onClose: () => void;
};

export function LeaderboardPopup({ onClose }: LeaderboardPopupProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          minWidth: 320,
          minHeight: 320,
          background: "transparent",
          borderRadius: 20,
          padding: "32px 24px 24px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Leaderboard />
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: COLORS.maize,
            border: `2px solid ${COLORS.purple}`,
            borderRadius: "50%",
            width: 32,
            height: 32,
            fontSize: 18,
            cursor: "pointer",
            zIndex: 2,
          }}
          aria-label="Close leaderboard"
        >
          ✕
        </button>
      </div>
    </div>
  );
}