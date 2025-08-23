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
        width: 40,
        height: 40,
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
        fontSize: 20, // match leaderboard button
      }}
      aria-label={audioOn ? "Mute audio" : "Unmute audio"}
    >
      <img
        src={ICONS.sound}
        alt={audioOn ? "Sound on" : "Sound off"}
        width={20}
        height={20}
        style={{ display: "block" }}
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