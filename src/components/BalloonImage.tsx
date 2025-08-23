type BalloonImageProps = {
  getWidth: () => number;
};

export function BalloonImage({ getWidth }: BalloonImageProps) {
  return (
    <>
      <img
        src="/baloons.png"
        alt=""
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          width: `${getWidth()}px`,
          height: "auto",
          opacity: 1,
          pointerEvents: "none",
          zIndex: 1,
          transition: "width 0.2s",
          animation: "balloon-float 2.8s ease-in-out infinite",
        }}
      />
      <style>
        {`
        @keyframes balloon-float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
          100% { transform: translateY(0); }
        }
        `}
      </style>
    </>
  );
}