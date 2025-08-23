import React, { useRef, useLayoutEffect, useState } from "react";
import { COLORS } from "../maps/colors.map";
import { BalloonImage } from "./BalloonImage";
import { SpiderwebImage } from "./SpiderwebImage";
import { WormImage } from "./WormImage";

type GameLayoutProps = {
  children: React.ReactNode;
};

export function GameLayout({ children }: GameLayoutProps) {
  const layoutRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useState(0);

  // Force update on mount, resize, and orientation change
  useLayoutEffect(() => {
    const handleResize = () => forceUpdate((n) => n + 1);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    // Initial update after refs are set
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Helper to calculate width with a minimum value
  const getBalloonWidth = () => {
    if (layoutRef.current && canvasRef.current) {
      const width =
        canvasRef.current.getBoundingClientRect().left -
        layoutRef.current.getBoundingClientRect().left +
        canvasRef.current.offsetWidth * 0.3;
      return Math.max(64, width); // 64px minimum
    }
    return 64;
  };

  const getSpiderwebWidth = () => {
    if (layoutRef.current && canvasRef.current) {
      const width =
        layoutRef.current.getBoundingClientRect().right -
        canvasRef.current.getBoundingClientRect().right +
        canvasRef.current.offsetWidth * 0.3;
      return Math.max(64, width); // 64px minimum
    }
    return 64;
  };

  // Helper to calculate worm width (similar to spiderweb)
  const getWormWidth = () => {
    if (layoutRef.current && canvasRef.current) {
      const width =
        canvasRef.current.getBoundingClientRect().left -
        layoutRef.current.getBoundingClientRect().left +
        canvasRef.current.offsetWidth * 0.18;
      return Math.max(48, width); // 48px minimum
    }
    return 48;
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