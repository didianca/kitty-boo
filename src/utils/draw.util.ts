import type { Item } from "../types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, ITEM_RADIUS_BY_LEVEL } from "../constants";
import { drawItem } from "./drawItem.util";
import { itemImages } from "./itemImages.util";
import { COLORS } from "../maps/colors.map";

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
  context.save();
  context.globalAlpha = 0.85; // 85% opacity
  context.fillStyle = COLORS.sunset; // or hexToRgba(COLORS.sunset, 0.85)
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.restore();

  // Draw all items as PNGs
  for (const item of items) {
    drawItem(context, item);
  }

  // Preview next item as PNG
  const previewX = Math.max(12, Math.min(CANVAS_WIDTH - 12, aimX));
  const previewRadius = ITEM_RADIUS_BY_LEVEL[Math.min(nextLevel, ITEM_RADIUS_BY_LEVEL.length - 1)];
  const previewImageIndex = nextLevel % itemImages.length;
  const previewImage = itemImages[previewImageIndex];

  // Move preview item further down to avoid overlap with score bubble and sound button
  const previewY = 60 + previewRadius; // or even 50 + previewRadius
  context.save();
  context.translate(previewX, previewY);

  if (previewImage.complete && previewImage.naturalWidth > 0) {
    context.drawImage(previewImage, -previewRadius, -previewRadius, previewRadius * 2, previewRadius * 2);
  } else {
    context.beginPath();
    context.arc(0, 0, previewRadius, 0, Math.PI * 2);
    context.fillStyle = "#ccc";
    context.fill();
  }
  context.restore();

  // Draw a dotted line from the preview item to the bottom or first item it touches
  let previewLineEndY = CANVAS_HEIGHT;
  const sortedItems = items
    .filter(item => Math.abs(item.positionX - previewX) < previewRadius + item.radius)
    .sort((a, b) => a.positionY - b.positionY);
  for (const item of sortedItems) {
    if (item.positionY > previewY + previewRadius) {
      previewLineEndY = item.positionY - item.radius;
      break;
    }
  }
  context.save();
  context.setLineDash([6, 8]);
  context.strokeStyle = "#75108B";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(previewX, previewY + previewRadius);
  context.lineTo(previewX, previewLineEndY);
  context.stroke();
  context.setLineDash([]);
  context.restore();

  // Cute font for score and game over
  if (gameOver) {
    context.font = "bold 28px 'Fredoka One', system-ui, -apple-system, Segoe UI, Roboto";
    context.fillStyle = "#B8D14B";
    context.fillText("Game Over — press R", 40, CANVAS_HEIGHT / 2);
  }

  // Score bubble settings
  const scoreText = `Score: ${score}`;
  context.font = "bold 26px 'Fredoka One', system-ui, -apple-system, Segoe UI, Roboto";
  const textMetrics = context.measureText(scoreText);
  const paddingX = 24;
  const bubbleWidth = textMetrics.width + paddingX;
  const bubbleHeight = 44;
  const bubbleX = 16;
  const bubbleY = 16;

  // Draw bubble (rounded rectangle)
  context.save();
  context.globalAlpha = 0.95;
  context.fillStyle = COLORS.maize; // Maize
  context.strokeStyle = COLORS.purple;
  context.lineWidth = 3;
  context.beginPath();
  const radius = 18;
  context.moveTo(bubbleX + radius, bubbleY);
  context.lineTo(bubbleX + bubbleWidth - radius, bubbleY);
  context.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + radius);
  context.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - radius);
  context.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - radius, bubbleY + bubbleHeight);
  context.lineTo(bubbleX + radius, bubbleY + bubbleHeight);
  context.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - radius);
  context.lineTo(bubbleX, bubbleY + radius);
  context.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
  context.closePath();
  context.shadowColor = "#75108B";
  context.shadowBlur = 8;
  context.fill();
  context.shadowBlur = 0;
  context.stroke();
  context.restore();

  // Draw score text
  context.save();
  context.font = "bold 26px 'Fredoka One', system-ui, -apple-system, Segoe UI, Roboto";
  context.fillStyle = "#75108B";
  context.textBaseline = "middle";
  context.textAlign = "left";
  context.fillText(scoreText, bubbleX + paddingX / 2, bubbleY + bubbleHeight / 2 + 2);
  context.restore();

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
  const borderOffset = 8;
  const gameOverLineY = borderOffset + (CANVAS_HEIGHT - 2 * borderOffset) * 0.2;
  context.save();
  const gradient = context.createLinearGradient(0, gameOverLineY, CANVAS_WIDTH, gameOverLineY);
  gradient.addColorStop(0, COLORS.maize);
  gradient.addColorStop(1, COLORS.yellowGreen);

  context.strokeStyle = gradient;
  context.lineWidth = 10;
  context.shadowColor = COLORS.yellowGreen;
  context.shadowBlur = 18;

  // Draw a straight, thick, glowing line
  context.beginPath();
  context.moveTo(borderOffset + 2, gameOverLineY);
  context.lineTo(CANVAS_WIDTH - borderOffset - 2, gameOverLineY);
  context.stroke();

  context.restore();

  // Stylized, thick, dashed, or double border
  context.save();
  context.lineWidth = 8;
  context.strokeStyle = COLORS.purple;
  context.setLineDash([18, 8]); // dashed border
  context.shadowColor = COLORS.maize;
  context.shadowBlur = 12;

  const borderRadiusDashed = 16;
  context.beginPath();
  context.moveTo(borderRadiusDashed, 4);
  context.lineTo(CANVAS_WIDTH - borderRadiusDashed, 4);
  context.quadraticCurveTo(CANVAS_WIDTH - 4, 4, CANVAS_WIDTH - 4, borderRadiusDashed);
  context.lineTo(CANVAS_WIDTH - 4, CANVAS_HEIGHT - borderRadiusDashed);
  context.quadraticCurveTo(CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4, CANVAS_WIDTH - borderRadiusDashed, CANVAS_HEIGHT - 4);
  context.lineTo(borderRadiusDashed, CANVAS_HEIGHT - 4);
  context.quadraticCurveTo(4, CANVAS_HEIGHT - 4, 4, CANVAS_HEIGHT - borderRadiusDashed);
  context.lineTo(4, borderRadiusDashed);
  context.quadraticCurveTo(4, 4, borderRadiusDashed, 4);
  context.closePath();
  context.stroke();
  context.setLineDash([]);
  context.shadowBlur = 0;
  context.restore();
}