import React from "react";

type WormImageProps = {
  getWidth: () => number;
};

export function WormImage({ getWidth }: WormImageProps) {
  return (
    <img
      src="/worm.png"
      alt=""
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${getWidth()}px`,
        height: "auto",
        opacity: 1,
        pointerEvents: "none",
        zIndex: 1,
        transition: "width 0.2s",
        // animation and transformOrigin removed to make it static
      }}
    />
  );
}