import type { Item } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, ITEM_RADIUS_BY_LEVEL } from "./constants";
import { drawItem } from "./drawItem";
import { itemImages } from "./itemImages";

export function draw(
  context: CanvasRenderingContext2D,
  items: Item[],
  aimX: number,
  nextLevel: number,
  score: number,
  gameOver: boolean
) {
  // Sunset background
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#F0D3A2"; // sunset
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw all items as PNGs
  for (const item of items) {
    drawItem(context, item);
  }

  // Preview next item as PNG
  const previewX = Math.max(12, Math.min(CANVAS_WIDTH - 12, aimX));
  const previewRadius = ITEM_RADIUS_BY_LEVEL[Math.min(nextLevel, ITEM_RADIUS_BY_LEVEL.length - 1)];
  const previewImageIndex = nextLevel % itemImages.length;
  const previewImage = itemImages[previewImageIndex];

  context.save();
  context.translate(previewX, 40 + previewRadius);

  if (previewImage.complete && previewImage.naturalWidth > 0) {
    context.drawImage(previewImage, -previewRadius, -previewRadius, previewRadius * 2, previewRadius * 2);
  } else {
    // fallback: draw a circle if image not loaded yet or broken
    context.beginPath();
    context.arc(0, 0, previewRadius, 0, Math.PI * 2);
    context.fillStyle = "#ccc";
    context.fill();
  }
  context.restore();

  // Draw a dotted line from the preview item to the bottom or first item it touches
  let previewLineEndY = CANVAS_HEIGHT;
  // Find the first item directly below the preview
  const sortedItems = items
    .filter(item => Math.abs(item.positionX - previewX) < previewRadius + item.radius)
    .sort((a, b) => a.positionY - b.positionY);
  for (const item of sortedItems) {
    if (item.positionY > 40 + previewRadius * 2) {
      previewLineEndY = item.positionY - item.radius;
      break;
    }
  }
  context.save();
  context.setLineDash([6, 8]);
  context.strokeStyle = "#75108B";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(previewX, 40 + previewRadius * 2);
  context.lineTo(previewX, previewLineEndY);
  context.stroke();
  context.setLineDash([]);
  context.restore();

  // Cute font for score and game over
  context.font = "20px 'Fredoka One', system-ui, -apple-system, Segoe UI, Roboto";
  context.fillStyle = "#75108B";
  context.fillText(`Score: ${score}`, 12, 28);
  if (gameOver) {
    context.font = "bold 28px 'Fredoka One', system-ui, -apple-system, Segoe UI, Roboto";
    context.fillStyle = "#B8D14B";
    context.fillText("Game Over — press R", 40, CANVAS_HEIGHT / 2);
  }

  // Draw rounded, cartoony container border (Purple) matching canvas border-radius
  context.save();
  const borderRadius = 16; // px, matches CSS border-radius: 1rem
  const borderWidth = 8;
  context.lineWidth = borderWidth;
  context.strokeStyle = "#75108B";
  context.beginPath();
  // Draw rounded rectangle path
  context.moveTo(borderRadius, borderWidth / 2);
  context.lineTo(CANVAS_WIDTH - borderRadius, borderWidth / 2);
  context.quadraticCurveTo(
    CANVAS_WIDTH - borderWidth / 2,
    borderWidth / 2,
    CANVAS_WIDTH - borderWidth / 2,
    borderRadius
  );
  context.lineTo(CANVAS_WIDTH - borderWidth / 2, CANVAS_HEIGHT - borderRadius);
  context.quadraticCurveTo(
    CANVAS_WIDTH - borderWidth / 2,
    CANVAS_HEIGHT - borderWidth / 2,
    CANVAS_WIDTH - borderRadius,
    CANVAS_HEIGHT - borderWidth / 2
  );
  context.lineTo(borderRadius, CANVAS_HEIGHT - borderWidth / 2);
  context.quadraticCurveTo(
    borderWidth / 2,
    CANVAS_HEIGHT - borderWidth / 2,
    borderWidth / 2,
    CANVAS_HEIGHT - borderRadius
  );
  context.lineTo(borderWidth / 2, borderRadius);
  context.quadraticCurveTo(
    borderWidth / 2,
    borderWidth / 2,
    borderRadius,
    borderWidth / 2
  );
  context.closePath();
  context.stroke();
  context.restore();

  // Draw the game over line (Yellow Green), 20% below the top, inside the border
  const gameOverLineY =
    borderWidth / 2 + (CANVAS_HEIGHT - borderWidth) * 0.2;
  context.save();
  context.strokeStyle = "#B8D14B";
  context.lineWidth = 6;
  context.beginPath();
  context.moveTo(borderWidth + 2, gameOverLineY);
  context.lineTo(CANVAS_WIDTH - borderWidth - 2, gameOverLineY);
  context.stroke();
  context.restore();
}