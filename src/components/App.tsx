import { drop, getDropCooldownMs } from "../physics/drop";
import { physics } from "../physics";
import { draw } from "../utils/draw.util";
import type { Item } from "../types";
import { CANVAS_WIDTH, ITEM_RADIUS_BY_LEVEL, CONTAINER_INSET } from "../constants";
import { setAudioEnabled } from "../utils/sounds.util";
import { useRef, useState, useEffect } from "react";
import { useCallback } from "react";
import { GameLayout } from "./GameLayout";
import { AudioToggleButton } from "./AudioToggleButton";
import { GameCanvas } from "./GameCanvas";
import { ResetButton } from "./ResetButton";
import { addScoreToLeaderboard } from "../utils/leaderboard.util";
import { GameOverPopup } from "./GameOver";
import { LeaderboardButton } from "./LeaderboardButton";
import { LeaderboardPopup } from "./LeaderboardPopup";
import { GameTitle } from "./GameTitle";

export default function App() {
  const canvasReference = useRef<HTMLCanvasElement | null>(null);
  const animationFrameReference = useRef<number | null>(null);
  const itemsReference = useRef<Item[]>([]);
  const itemIdReference = useRef(1);
  const dropCooldownTimeRef = useRef<number>(0); // Track when next drop is allowed (in ms)
  const keyHoldRef = useRef(false); // whether space/arrow is currently held
  const dropRepeatTimerRef = useRef<number | null>(null);
  const leftHoldRef = useRef(false);
  const rightHoldRef = useRef(false);
  const moveIntervalRef = useRef<number | null>(null);
  const [score, setScore] = useState(0);
  const [nextItemLevel, setNextItemLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const aimXReference = useRef(CANVAS_WIDTH / 2);
  const [audioOn, setAudioOn] = useState(true); // <-- change this to useState
  const [dragging, setDragging] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Handle dropping a new item with cooldown enforcement
  const handleDrop = useCallback(
    () => {
      const now = Date.now();
      
      // Check if we're still in cooldown
      if (now < dropCooldownTimeRef.current) {
        return; // Still in cooldown, don't drop
      }
      
      // Get the radius of the item we're about to drop
      const itemRadius = ITEM_RADIUS_BY_LEVEL[Math.min(nextItemLevel, ITEM_RADIUS_BY_LEVEL.length - 1)];
      
      // Perform the drop
      drop(
        itemsReference,
        itemIdReference,
        nextItemLevel,
        setNextItemLevel,
        aimXReference,
        gameOver
      );
      
      // Set the cooldown timer based on this item's travel time
      const cooldownMs = getDropCooldownMs(itemRadius);
      dropCooldownTimeRef.current = now + cooldownMs;

      // Clear any existing repeat timer
      if (dropRepeatTimerRef.current) {
        window.clearTimeout(dropRepeatTimerRef.current);
        dropRepeatTimerRef.current = null;
      }

      // If the user is holding the key, schedule the next drop after cooldown
      if (keyHoldRef.current) {
        dropRepeatTimerRef.current = window.setTimeout(() => {
          dropRepeatTimerRef.current = null;
          if (keyHoldRef.current) {
            handleDrop();
          }
        }, Math.max(0, cooldownMs));
      }
    },
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

  // Keyboard: reset on keydown for 'r', trigger drops on first keydown for Space/ArrowDown
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSpace = event.code === "Space" || event.key === " " || event.key === "Spacebar";
      const isArrowDown = event.key === "ArrowDown" || event.code === "ArrowDown";
      const isArrowLeft = event.key === "ArrowLeft" || event.code === "ArrowLeft";
      const isArrowRight = event.key === "ArrowRight" || event.code === "ArrowRight";

      // Prevent page scroll on Space and Arrow keys
      if (isSpace || isArrowDown || isArrowLeft || isArrowRight) event.preventDefault();

      if (event.key === "r" || event.key === "R") {
        resetGame();
      }

      // Mark key as held for repeat scheduling
      if (isSpace || isArrowDown) {
        keyHoldRef.current = true;
      }

      // Movement holds
      if (isArrowLeft) {
        leftHoldRef.current = true;
      }
      if (isArrowRight) {
        rightHoldRef.current = true;
      }

      // Trigger drop on first keydown (ignore repeats while holding)
      if ((isSpace || isArrowDown) && !event.repeat && !gameOver) {
        handleDrop();
      }

      // Start move interval if needed
      if ((leftHoldRef.current || rightHoldRef.current) && moveIntervalRef.current == null) {
        moveIntervalRef.current = window.setInterval(() => {
          const speed = 4; // pixels per tick
          let delta = 0;
          if (leftHoldRef.current) delta -= speed;
          if (rightHoldRef.current) delta += speed;
          if (delta !== 0) {
            aimXReference.current = Math.max(
              CONTAINER_INSET,
              Math.min(CANVAS_WIDTH - CONTAINER_INSET, aimXReference.current + delta)
            );
          }
        }, 16) as unknown as number;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const isSpace = event.code === "Space" || event.key === " " || event.key === "Spacebar";
      const isArrowDown = event.key === "ArrowDown" || event.code === "ArrowDown";
      const isArrowLeft = event.key === "ArrowLeft" || event.code === "ArrowLeft";
      const isArrowRight = event.key === "ArrowRight" || event.code === "ArrowRight";
      if (isSpace || isArrowDown) {
        keyHoldRef.current = false;
        if (dropRepeatTimerRef.current) {
          window.clearTimeout(dropRepeatTimerRef.current);
          dropRepeatTimerRef.current = null;
        }
      }
      if (isArrowLeft) leftHoldRef.current = false;
      if (isArrowRight) rightHoldRef.current = false;

      // Stop movement interval if neither arrow is held
      if (!leftHoldRef.current && !rightHoldRef.current && moveIntervalRef.current != null) {
        window.clearInterval(moveIntervalRef.current as number);
        moveIntervalRef.current = null;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
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
        className="app-content"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          width: "100%",
        }}
      >
        <div
          className="app-title-section"
          style={{
            flex: "2.5 2.5 0",
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
            marginBottom: "-3.2vh",
            pointerEvents: "none",
          }}
        >
          <GameTitle />
        </div>
        <div
          className="app-canvas-section"
          style={{
            flex: "7.5 7.5 0",
            minHeight: 0,
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            className="app-canvas-wrapper"
            style={{
              position: "relative",
              width: CANVAS_WIDTH,
            }}
          >
            <div
              className="app-toolbar"
              style={{
                position: "absolute",
                top: "clamp(8px, 2vw, 16px)",
                right: "clamp(8px, 2vw, 16px)",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "clamp(8px, 2vw, 20px)",
                zIndex: 20,
              }}
            >
              <AudioToggleButton audioOn={audioOn} setAudioOn={setAudioOn} />
              <LeaderboardButton onClick={() => setShowLeaderboard(true)} />
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
          </div>
          <ResetButton onClick={resetGame} />
        </div>
      </div>
      {showLeaderboard && (
        <LeaderboardPopup onClose={() => setShowLeaderboard(false)} />
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