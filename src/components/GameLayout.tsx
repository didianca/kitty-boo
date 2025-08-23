import React, { useRef, useLayoutEffect, useState } from "react";
import { COLORS } from "../maps/colors.map";

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
      <img
        src="/baloons.png"
        alt=""
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${getBalloonWidth()}px`,
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
      <img
        src="/spiderweb.png"
        alt=""
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: `${getSpiderwebWidth()}px`,
          height: "auto",
          opacity: 1,
          pointerEvents: "none",
          zIndex: 1,
          transition: "width 0.2s",
        }}
      />
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