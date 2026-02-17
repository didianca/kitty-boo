import { COLORS } from "../maps/colors.map";
import { ICONS } from "../maps/icons.map";

type AudioToggleButtonProps = {
  audioOn: boolean;
  setAudioOn: React.Dispatch<React.SetStateAction<boolean>>;
};

export function AudioToggleButton({ audioOn, setAudioOn }: AudioToggleButtonProps) {
  const toggleMute = () => setAudioOn(!audioOn);

  return (
    <button
      onClick={toggleMute}
      style={{
        width: "clamp(32px, 8vw, 40px)",
        height: "clamp(32px, 8vw, 40px)",
        borderRadius: "50%",
        border: `2px solid ${COLORS.purple}`,
        background: COLORS.maize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        fontSize: "clamp(16px, 2vw, 20px)",
      }}
      aria-label={audioOn ? "Mute audio" : "Unmute audio"}
    >
      <img
        src={ICONS.sound}
        alt={audioOn ? "Sound on" : "Sound off"}
        style={{ display: "block", width: "clamp(16px, 1.6vw, 20px)", height: "clamp(16px, 1.6vw, 20px)" }}
        draggable={false}
      />
      {/* Mute bar overlay */}
      {!audioOn && (
        <svg
          width={32}
          height={32}
          viewBox="0 0 32 32"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <line
            x1={0}
            y1={0}
            x2={32}
            y2={32}
            stroke={COLORS.purple}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}