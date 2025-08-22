import { drop } from "../physics/drop";
import { physics } from "../physics";
import { draw } from "../utils/draw.util";
import type { Item } from "../types";
import { CANVAS_WIDTH } from "../constants";
import { setAudioEnabled } from "../utils/sounds.util";
import { useRef, useState, useEffect } from "react";
import { useCallback } from "react";
import { GameLayout } from "./GameLayout";
import { AudioToggleButton } from "./AudioToggleButton";
import { GameCanvas } from "./GameCanvas";
import { ResetButton } from "./ResetButton";
import { addScoreToLeaderboard } from "../utils/leaderboard.util";
import { Leaderboard } from "./Leaderboard";
import { GameOverPopup } from "./GameOver";

export default function App() {
  const canvasReference = useRef<HTMLCanvasElement | null>(null);
  const animationFrameReference = useRef<number | null>(null);
  const itemsReference = useRef<Item[]>([]);
  const itemIdReference = useRef(1);
  const [score, setScore] = useState(0);
  const [nextItemLevel, setNextItemLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const aimXReference = useRef(CANVAS_WIDTH / 2);
  const [audioOn, setAudioOn] = useState(true); // <-- change this to useState
  const [dragging, setDragging] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Handle dropping a new item
  const handleDrop = useCallback(
    () =>
      drop(
        itemsReference,
        itemIdReference,
        nextItemLevel,
        setNextItemLevel,
        aimXReference,
        gameOver
      ),
    [nextItemLevel, gameOver]
  );

  // Pointer aiming and dropping
  useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const handlePointerDown = (event: PointerEvent) => {
      setDragging(true);
      const rect = canvas.getBoundingClientRect();
      aimXReference.current =
        ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const rect = canvas.getBoundingClientRect();
      aimXReference.current =
        ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    };

    const handlePointerUp = () => {
      if (dragging) {
        handleDrop();
        setDragging(false);
      }
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handleDrop, dragging]);

  // Reset game state
  const resetGame = useCallback(() => {
    itemsReference.current = [];
    setScore(0);
    setGameOver(false);
    setNextItemLevel(0);
  }, []);

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
  }, [gameOver, handleDrop, resetGame]);

  // Audio toggle effect
  useEffect(() => {
    setAudioEnabled(audioOn);
  }, [audioOn]);

  // Leaderboard effect
  useEffect(() => {
    if (gameOver && score > 0) {
      addScoreToLeaderboard(score);
    }
  }, [gameOver, score]);

  return (
    <GameLayout>
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20, // space between buttons
          zIndex: 20,
        }}
      >
        <AudioToggleButton audioOn={audioOn} setAudioOn={setAudioOn} />
        <button
          onClick={() => setShowLeaderboard(true)}
          style={{
            background: "#FFF04C",
            border: "2px solid #75108B",
            borderRadius: "50%",
            width: 40,
            height: 40,
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            margin: 0, // ensure no default margin
          }}
          aria-label="Show leaderboard"
        >
          🏆
        </button>
      </div>
      <GameCanvas
        itemsReference={itemsReference}
        itemIdReference={itemIdReference}
        nextItemLevel={nextItemLevel}
        aimXReference={aimXReference}
        gameOver={gameOver}
        setScore={setScore}
        setGameOver={setGameOver}
        score={score}
        handleDrop={handleDrop}
        leaderboardOpen={showLeaderboard}
      />
      <ResetButton onClick={resetGame} />
      {showLeaderboard && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowLeaderboard(false)}
        >
          <div
            style={{ position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative PNG in leaderboard popup corner */}
            <img
              src="/cloud.png"
              alt=""
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 80,
                opacity: 0.15,
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <Leaderboard />
            <button
              onClick={() => setShowLeaderboard(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "#FFF04C",
                border: "2px solid #75108B",
                borderRadius: "50%",
                width: 32,
                height: 32,
                fontSize: 18,
                cursor: "pointer",
                zIndex: 2,
              }}
              aria-label="Close leaderboard"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {gameOver && (
        <GameOverPopup
          score={score}
          onReset={resetGame}
        />
      )}
    </GameLayout>
  );
}