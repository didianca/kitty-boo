import React from "react";

type SpiderwebImageProps = {
  getWidth: () => number;
};

export function SpiderwebImage({ getWidth }: SpiderwebImageProps) {
  return (
    <img
      src="/spiderweb.png"
      alt=""
      style={{
        position: "absolute",
        top: 0,
        right: 0,
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