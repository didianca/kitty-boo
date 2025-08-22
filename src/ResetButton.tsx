import { COLORS } from "./colors";

type ResetButtonProps = {
  onClick: () => void;
};

export function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 16,
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
      onMouseOver={e => {
        (e.currentTarget as HTMLButtonElement).style.background =
          `linear-gradient(90deg, ${COLORS.yellowGreen} 0%, ${COLORS.maize} 100%)`;
        (e.currentTarget as HTMLButtonElement).style.color = COLORS.magentaHaze;
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLButtonElement).style.background =
          `linear-gradient(90deg, ${COLORS.maize} 0%, ${COLORS.yellowGreen} 100%)`;
        (e.currentTarget as HTMLButtonElement).style.color = COLORS.purple;
      }}
    >
      Reset
    </button>
  );
}