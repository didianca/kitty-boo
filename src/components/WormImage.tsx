import { useEffect, useState } from "react";

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

  const src = frame === 0 ? "/worm.png" : "/worm1.png";

  return (
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
      }}
    />
  );
}