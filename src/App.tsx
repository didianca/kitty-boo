import { useRef, useState, useEffect } from "react";
import { drop } from "./drop";
import { physics } from "./physics";
import { draw } from "./draw";
import type { Item } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

export default function App() {
  const canvasReference = useRef<HTMLCanvasElement | null>(null);
  const animationFrameReference = useRef<number | null>(null);
  const itemsReference = useRef<Item[]>([]);
  const itemIdReference = useRef(1);
  const [score, setScore] = useState(0);
  const [nextItemLevel, setNextItemLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const aimXReference = useRef(CANVAS_WIDTH / 2);

  // Handle dropping a new item
  const handleDrop = () =>
    drop(
      itemsReference,
      itemIdReference,
      nextItemLevel,
      setNextItemLevel,
      aimXReference,
      gameOver
    );

  // Pointer aiming and dropping
  useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) return;
    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      aimXReference.current = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    };
    const handlePointerDown = () => handleDrop();

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
    };
  });

  // Reset game state
  const resetGame = () => {
    itemsReference.current = [];
    setScore(0);
    setGameOver(false);
    setNextItemLevel(0);
  };

  // Main game loop
  useEffect(() => {
    const context = canvasReference.current?.getContext("2d");
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
      animationFrameReference.current = animationFrameId;
    };
    animationFrameId = requestAnimationFrame(step);
    animationFrameReference.current = animationFrameId;
    return () => {
      if (animationFrameReference.current) {
        cancelAnimationFrame(animationFrameReference.current);
      }
    };
  }, [gameOver, nextItemLevel, score]);

  // Keyboard reset
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "r" || event.key === "R") {
        resetGame();
      }
      if ((event.key === " " || event.key === "ArrowDown") && !gameOver) {
        handleDrop();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, nextItemLevel]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="flex flex-col gap-3 items-center">
        <canvas
          ref={canvasReference}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="rounded-2xl shadow-xl border border-gray-700 touch-none select-none"
          style={{ background: "#111827" }}
        />
        <button
          onClick={handleDrop}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
          disabled={gameOver}
        >
          Drop
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
