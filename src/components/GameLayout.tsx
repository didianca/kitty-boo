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
      // Clamp between 48px and 25vw (reduced from 40vw)
      return clamp(width * 0.7, 48, window.innerWidth * 0.25);
    }
    return 64;
  };

  const getSpiderwebWidth = () => {
    if (layoutRef.current && canvasRef.current) {
      const width =
        layoutRef.current.getBoundingClientRect().right -
        canvasRef.current.getBoundingClientRect().right +
        canvasRef.current.offsetWidth * 0.3;
      // Clamp between 48px and 25vw (reduced from 40vw)
      return clamp(width * 0.7, 48, window.innerWidth * 0.25);
    }
    return 64;
  };

  const getWormWidth = () => {
    if (layoutRef.current && canvasRef.current) {
      const layoutRect = layoutRef.current.getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const available = canvasRect.left - layoutRect.left;
      // Clamp between 96px and 20vw (reduced from 40vw for mobile friendliness)
      return clamp(available * 0.6, 80, window.innerWidth * 0.2);
    }
    return 80;
  };

  return (
    <div
      id="game-layout"
      className="game-layout"
      ref={layoutRef}
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: `radial-gradient(ellipse at 60% 20%, ${COLORS.yellowGreen} 0%, ${COLORS.princetonOrange} 40%, ${COLORS.purple} 100%)`,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Decorative PNGs in corners */}
      <BalloonImage getWidth={getBalloonWidth} />
      <SpiderwebImage getWidth={getSpiderwebWidth} />
      <WormImage getWidth={getWormWidth} />
      <div
        id="game-layout-content"
        ref={canvasRef}
        className="game-layout-content flex flex-col items-center relative"
        style={{
          zIndex: 2,
          minHeight: "min(100vh, 100dvh)",
          width: "100%",
          maxWidth: 420,
          flexShrink: 0,
          padding: "min(2vh, 16px) 0",
        }}
      >
        {children}
      </div>
    </div>
  );
}