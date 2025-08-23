import React, { useRef, useLayoutEffect, useState } from "react";
import { COLORS } from "../maps/colors.map";
import { BalloonImage } from "./BalloonImage";
import { SpiderwebImage } from "./SpiderwebImage";
import { WormImage } from "./WormImage";

type GameLayoutProps = {
  children: React.ReactNode;
};

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export function GameLayout({ children }: GameLayoutProps) {
  const layoutRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useState(0);

  // Force update on mount, resize, and orientation change
  useLayoutEffect(() => {
    const handleResize = () => forceUpdate((n) => n + 1);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Responsive width helpers
  const getBalloonWidth = () => {
    if (layoutRef.current && canvasRef.current) {
      const width =
        canvasRef.current.getBoundingClientRect().left -
        layoutRef.current.getBoundingClientRect().left +
        canvasRef.current.offsetWidth * 0.3;
      // Clamp between 48px and 40vw
      return clamp(width * 0.7, 48, window.innerWidth * 0.4);
    }
    return 64;
  };

  const getSpiderwebWidth = () => {
    if (layoutRef.current && canvasRef.current) {
      const width =
        layoutRef.current.getBoundingClientRect().right -
        canvasRef.current.getBoundingClientRect().right +
        canvasRef.current.offsetWidth * 0.3;
      return clamp(width * 0.7, 48, window.innerWidth * 0.4);
    }
    return 64;
  };

  const getWormWidth = () => {
    if (layoutRef.current && canvasRef.current) {
      const layoutRect = layoutRef.current.getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const available = canvasRect.left - layoutRect.left;
      // Increase the minimum width for mobile friendliness
      return clamp(available * 0.7, 96, window.innerWidth * 0.4); // min 96px
    }
    return 96;
  };

  return (
    <div
      ref={layoutRef}
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: `radial-gradient(ellipse at 60% 20%, ${COLORS.yellowGreen} 0%, ${COLORS.princetonOrange} 40%, ${COLORS.purple} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative PNGs in corners */}
      <BalloonImage getWidth={getBalloonWidth} />
      <SpiderwebImage getWidth={getSpiderwebWidth} />
      <WormImage getWidth={getWormWidth} />
      <div
        ref={canvasRef}
        className="flex flex-col gap-3 items-center relative"
        style={{ zIndex: 2 }}
      >
        {children}
      </div>
    </div>
  );
}