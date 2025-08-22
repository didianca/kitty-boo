import soundIcon from "../../public/sound.png";
import { COLORS } from "../maps/colors.map";

type AudioToggleButtonProps = {
  audioOn: boolean;
  setAudioOn: (on: boolean) => void;
};

export function AudioToggleButton({ audioOn, setAudioOn }: AudioToggleButtonProps) {
  return (
    <button
      onClick={() => setAudioOn(!audioOn)}
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
              stroke={COLORS.purple}
              strokeWidth={4}
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}