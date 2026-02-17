import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.BASE_URL;

type WormImageProps = {
  getWidth: () => number;
};

export function WormImage({ getWidth }: WormImageProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const src = frame === 0 ? `${BASE_URL}worm.png` : `${BASE_URL}worm1.png`;
  const isShaking = frame === 1;

  // 0.4s for shake, 3s for pause = 3.4s total
  return (
    <>
      <img
        src={src}
        alt=""
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          width: `${getWidth()}px`,
          height: "auto",
          opacity: 1,
          pointerEvents: "none",
          zIndex: 1,
          transition: "width 0.2s",
          animation: isShaking ? "worm-shake 3.4s linear infinite" : undefined,
        }}
      />
      <style>
        {`
        @keyframes worm-shake {
          0% { transform: translateX(0); }
          6% { transform: translateX(-6px); }
          12% { transform: translateX(6px); }
          18% { transform: translateX(-6px); }
          24% { transform: translateX(6px); }
          25% { transform: translateX(0); }
          100% { transform: translateX(0); }
        }
        `}
      </style>
    </>
  );
}