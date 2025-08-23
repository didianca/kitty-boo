import { useRef, useEffect } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants";
import { draw } from "../utils/draw.util";
import { physics } from "../physics";
import type { Item } from "../types";
import { COLORS } from "../maps/colors.map";

type GameCanvasProps = {
  itemsReference: React.RefObject<Item[]>;
  itemIdReference: React.RefObject<number>;
  nextItemLevel: number;
  aimXReference: React.RefObject<number>;
  gameOver: boolean;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  score: number;
  handleDrop: () => void;
  leaderboardOpen?: boolean;
};

export function GameCanvas({
  itemsReference,
  itemIdReference,
  nextItemLevel,
  aimXReference,
  gameOver,
  setScore,
  setGameOver,
  score,
  handleDrop,
  leaderboardOpen = false,
}: GameCanvasProps) {
  const canvasReference = useRef<HTMLCanvasElement | null>(null);
  const draggingRef = useRef(false);
  const droppingRef = useRef(false);

  // Helper to check if a y coordinate is below the game over line
  const isBelowGameOverLine = (y: number, rect: DOMRect) => {
    const CONTAINER_INSET = 8; // or your actual value
    const GAME_OVER_LINE_Y =
      CONTAINER_INSET + (rect.height - 2 * CONTAINER_INSET) * 0.2;
    return y > GAME_OVER_LINE_Y;
  };

  // Pointer aiming and dropping
  useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const handlePointerDown = (event: PointerEvent) => {
      draggingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      aimXReference.current =
        ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      aimXReference.current =
        ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (droppingRef.current) return;
      if (!canvas) return;
      if (leaderboardOpen) return;
      const rect = canvas.getBoundingClientRect();
      const y = event.clientY - rect.top;
      if (isBelowGameOverLine(y, rect)) {
        handleDrop();
        droppingRef.current = true;
        setTimeout(() => {
          droppingRef.current = false;
        }, 100);
      }
    };

    // Always update aimXReference on mouse move (even if not dragging)
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      aimXReference.current =
        ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [aimXReference, handleDrop, leaderboardOpen]);

  // Animation and game loop
  useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId: number;
    const step = () => {
      physics(
        itemsReference.current,
        setScore,
        setGameOver,
        gameOver,
        itemIdReference
      );
      draw(
        context,
        itemsReference.current,
        aimXReference.current,
        nextItemLevel,
        score,
        gameOver
      );
      animationFrameId = requestAnimationFrame(step);
    };
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    itemsReference,
    setScore,
    setGameOver,
    gameOver,
    itemIdReference,
    aimXReference,
    nextItemLevel,
    score,
  ]);

  return (
    <canvas
      ref={canvasReference}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="rounded-2xl shadow-xl border border-gray-700 touch-none select-none"
      style={{ background: "transparent" }}
      onTouchStart={(e) => {
        if (e.touches.length > 1) e.preventDefault();
      }}
      onDoubleClick={(e) => e.preventDefault()}
    />
  );
}