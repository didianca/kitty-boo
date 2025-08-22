import type { Item } from "../types";
import { itemImages } from "./itemImages.util";

export function drawItem(
  context: CanvasRenderingContext2D,
  item: Item
) {
  context.save();
  context.translate(item.positionX, item.positionY);

  const image = itemImages[item.level % itemImages.length];
  const size = item.radius * 2;

  // Only draw if image is loaded and not broken
  if (image.complete && image.naturalWidth > 0) {
    context.drawImage(image, -item.radius, -item.radius, size, size);
  } else {
    // fallback: draw a circle if image not loaded yet or broken
    context.beginPath();
    context.arc(0, 0, item.radius, 0, Math.PI * 2);
    context.fillStyle = "#ccc";
    context.fill();
  }

  context.restore();
}