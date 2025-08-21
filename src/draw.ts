import type { Item } from "./types";
import { W as CANVAS_WIDTH, H as CANVAS_HEIGHT, RADIUS_BY_LEVEL } from "./constants";

export function drawItem(context: CanvasRenderingContext2D, item: Item) {
  context.save();
  context.translate(item.x, item.y);
  drawBubble(context, item.r, item.level);
  context.restore();
}

export function drawBubble(context: CanvasRenderingContext2D, radius: number, level: number) {
  const hue = (level * 45) % 360;
  const gradient = context.createRadialGradient(-radius * 0.3, -radius * 0.3, radius * 0.2, 0, 0, radius);
  gradient.addColorStop(0, `hsl(${hue} 80% 70%)`);
  gradient.addColorStop(1, `hsl(${hue} 80% 45%)`);
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();

  context.globalAlpha = 0.25;
  context.beginPath();
  context.ellipse(-radius * 0.35, -radius * 0.35, radius * 0.5, radius * 0.35, 0, 0, Math.PI * 2);
  context.fillStyle = "#fff";
  context.fill();
  context.globalAlpha = 1;

  context.fillStyle = "rgba(0,0,0,0.7)";
  context.font = `${Math.max(12, radius * 0.65)}px system-ui, -apple-system, Segoe UI, Roboto`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(String(level), 0, 2);
}

export function draw(
  context: CanvasRenderingContext2D,
  items: Item[],
  aimX: number,
  nextLevel: number,
  score: number,
  gameOver: boolean
) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#101214";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#1f2937";
  context.fillRect(4, 4, CANVAS_WIDTH - 8, CANVAS_HEIGHT - 8);

  for (const item of items) {
    drawItem(context, item);
  }

  const previewX = Math.max(12, Math.min(CANVAS_WIDTH - 12, aimX));
  context.globalAlpha = 0.6;
  context.fillStyle = "#e5e7eb";
  context.fillRect(previewX - 1, 0, 2, 80);
  context.globalAlpha = 1;

  const previewRadius = RADIUS_BY_LEVEL[Math.min(nextLevel, RADIUS_BY_LEVEL.length - 1)];
  context.save();
  context.translate(previewX, 40 + previewRadius);
  drawBubble(context, previewRadius, nextLevel);
  context.restore();

  context.font = "16px system-ui, -apple-system, Segoe UI, Roboto";
  context.fillStyle = "#e5e7eb";
  context.fillText(`Score: ${score}`, 12, 24);
  if (gameOver) {
    context.font = "bold 24px system-ui, -apple-system, Segoe UI, Roboto";
    context.fillText("Game Over — press R", 50, CANVAS_HEIGHT / 2);
  }
}