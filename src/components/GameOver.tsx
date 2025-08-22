import { COLORS } from "../maps/colors.map";
import { getBestScore } from "../utils/getBestScore.util";

type GameOverPopupProps = {
  score: number;
  onReset: () => void;
};

export function GameOverPopup({ score, onReset }: GameOverPopupProps) {
  const best = getBestScore();
  const isNewBest = score > best;

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
        zIndex: 200,
      }}
    >
      <div
        style={{
          background: COLORS.maize,
          border: `3px solid ${COLORS.purple}`,
          borderRadius: 22,
          padding: "32px 40px",
          minWidth: 320,
          boxShadow: `0 2px 24px ${COLORS.purple}44`,
          textAlign: "center",
          position: "relative",
        }}
      >
        <h2 style={{ color: COLORS.purple, fontSize: 28, margin: 0, fontWeight: "bold" }}>
          Game Over!
        </h2>
        <div style={{ margin: "24px 0 12px 0", fontSize: 22, color: COLORS.purple }}>
          Your Score: <span style={{ fontWeight: "bold" }}>{score}</span>
        </div>
        <div style={{ fontSize: 18, color: COLORS.magentaHaze }}>
          {isNewBest ? (
            <span>🎉 <b>New Best!</b></span>
          ) : (
            <>
              Best Score: <b>{best}</b>
            </>
          )}
        </div>
        <button
          onClick={onReset}
          style={{
            marginTop: 28,
            padding: "10px 32px",
            borderRadius: 20,
            background: `linear-gradient(90deg, ${COLORS.maize} 0%, ${COLORS.yellowGreen} 100%)`,
            color: COLORS.purple,
            fontWeight: "bold",
            fontSize: 20,
            border: `2px solid ${COLORS.purple}`,
            boxShadow: `0 2px 12px ${COLORS.purple}33`,
            letterSpacing: 1,
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}