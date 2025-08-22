import React from "react";
import { COLORS } from "./colors";

type GameLayoutProps = {
  children: React.ReactNode;
};

export function GameLayout({ children }: GameLayoutProps) {
  return (
    <div
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
      {/* Optional: Add floating shapes or icons for extra cuteness */}
      {/* <img src="/star.png" style={{position: "absolute", top: 40, left: 60, opacity: 0.2, width: 60}} /> */}
      <div className="flex flex-col gap-3 items-center relative">
        {children}
      </div>
    </div>
  );
}