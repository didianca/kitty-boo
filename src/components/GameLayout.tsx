import React, { useRef, useLayoutEffect, useState } from "react";
import { COLORS } from "../maps/colors.map";

type GameLayoutProps = {
  children: React.ReactNode;
};

export function GameLayout({ children }: GameLayoutProps) {
  const layoutRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [cornerSpace, setCornerSpace] = useState({ left: 0, bottom: 0, right: 0, top: 0 });

  useLayoutEffect(() => {
    function updateSpace() {
      if (!layoutRef.current || !canvasRef.current) return;
      const layoutRect = layoutRef.current.getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setCornerSpace({
        left: canvasRect.left - layoutRect.left,
        bottom: layoutRect.bottom - canvasRect.bottom,
        right: layoutRect.right - canvasRect.right,
        top: canvasRect.top - layoutRect.top,
      });
    }
    updateSpace();
    window.addEventListener("resize", updateSpace);
    return () => window.removeEventListener("resize", updateSpace);
  }, []);

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
        src="/baloon.png"
        alt=""
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${Math.max(0, layoutRef.current && canvasRef.current
            ? (canvasRef.current.getBoundingClientRect().left - layoutRef.current.getBoundingClientRect().left + canvasRef.current.offsetWidth * 0.3)
            : 0)}px`,
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
          width: `${Math.max(0, layoutRef.current && canvasRef.current
            ? (layoutRef.current.getBoundingClientRect().right - canvasRef.current.getBoundingClientRect().right + canvasRef.current.offsetWidth * 0.3)
            : 0)}px`,
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