const BASE_URL = import.meta.env.BASE_URL;

export function GameTitle() {
  return (
    <div
      className="game-title"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        pointerEvents: "none",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="game-title-crop"
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          className="game-title-img"
          src={`${BASE_URL}resources/game_title.png`}
          alt="Kitty Boo"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            transform: "scale(1.7) translateY(10%)",
            transformOrigin: "center center",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
