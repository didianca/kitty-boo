import { getLeaderboard } from "../utils/leaderboard.util";
import { COLORS } from "../maps/colors.map";

export function Leaderboard() {
  const leaderboard = getLeaderboard();
  return (
    <div
      id="leaderboard"
      className="leaderboard"
      style={{
        background: COLORS.maize,
        color: COLORS.purple,
        borderRadius: 22,
        padding: "14px 28px",
        marginTop: 24,
        minWidth: 220,
        boxShadow: `0 2px 12px ${COLORS.purple}33`,
        border: `3px solid ${COLORS.purple}`,
        display: "inline-block",
        fontFamily: "'Fredoka One', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <h2
        id="leaderboard-title"
        className="leaderboard-title"
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: "bold",
          color: COLORS.purple,
          letterSpacing: 1,
          textAlign: "center",
          textShadow: `0 2px 8px ${COLORS.white}88`,
        }}
      >
        Leaderboard
      </h2>
      <ol id="leaderboard-list" className="leaderboard-list" style={{ paddingLeft: 20, margin: 0, marginTop: 10 }}>
        {leaderboard.map((entry, i) => {
          const dateObj = new Date(entry.date);
          const dateStr = dateObj.toLocaleDateString();
          const timeStr = dateObj
            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <li
              key={i}
              style={{
                marginBottom: 6,
                fontSize: 18,
                fontWeight: "bold",
                color: COLORS.purple,
                display: "flex",
                alignItems: "center",
                gap: 8,
                textShadow: `0 1px 4px ${COLORS.white}44`,
              }}
            >
              <span style={{ minWidth: 32, display: "inline-block" }}>{entry.score}</span>
              <span
                style={{
                  fontSize: 13,
                  color: COLORS.magentaHaze,
                  fontWeight: "normal",
                  marginLeft: 4,
                  textShadow: "none",
                }}
              >
                {dateStr} {timeStr}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}