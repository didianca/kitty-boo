import { useRef, useEffect } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { draw } from "./draw";
import { physics } from "./physics";
import type { Item } from "./types";

type GameCanvasProps = {
  itemsReference: React.MutableRefObject<Item[]>;
  itemIdReference: React.MutableRefObject<number>;
  nextItemLevel: number;
  aimXReference: React.MutableRefObject<number>;
  gameOver: boolean;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  score: number;
  handleDrop: () => void;
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
}: GameCanvasProps) {
  const canvasReference = useRef<HTMLCanvasElement | null>(null);
  const draggingRef = useRef(false);

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

    const handlePointerUp = () => {
      if (draggingRef.current) {
        handleDrop();
        draggingRef.current = false;
      }
    };

    const handleClick = (event: MouseEvent) => {
      // For desktop: update aim and drop
      const rect = canvas.getBoundingClientRect();
      aimXReference.current =
        ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
      handleDrop();
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("click", handleClick);
    };
  }, [aimXReference, handleDrop]);

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
  }, [itemsReference, setScore, setGameOver, gameOver, itemIdReference, aimXReference, nextItemLevel, score]);

  return (
    <canvas
      ref={canvasReference}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="rounded-2xl shadow-xl border border-gray-700 touch-none select-none"
      style={{ background: "#111827" }}
      onTouchStart={e => {
        if (e.touches.length > 1) e.preventDefault();
      }}
      onDoubleClick={e => e.preventDefault()}
    />
  );
}