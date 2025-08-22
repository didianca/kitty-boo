import soundIcon from "../../public/sound.png"; // adjust path if needed
import { COLORS } from "../utils/colors";

type AudioToggleButtonProps = {
  audioOn: boolean;
  setAudioOn: (on: boolean) => void;
};

export function AudioToggleButton({ audioOn, setAudioOn }: AudioToggleButtonProps) {
  return (
    <button
      onClick={() => setAudioOn(!audioOn)}
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 10,
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
        overflow: "hidden",
      }}
      aria-label={audioOn ? "Mute audio" : "Unmute audio"}
    >
      <span style={{ position: "relative", width: 24, height: 24, display: "inline-block" }}>
        <img
          src={soundIcon}
          alt={audioOn ? "Sound on" : "Sound off"}
          style={{
            width: 24,
            height: 24,
            display: "block",
          }}
        />
        {!audioOn && (
          <svg
            width={40}
            height={40}
            viewBox="0 0 40 40"
            style={{
              position: "absolute",
              left: -8,
              top: -8,
              pointerEvents: "none",
            }}
          >
            <line
              x1={0}
              y1={0}
              x2={40}
              y2={40}
              stroke="#75108B"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}