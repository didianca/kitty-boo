import type { Item } from "../types";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRAVITY_ACCELERATION,
  FLOOR_BOUNCE_FACTOR,
  WALL_BOUNCE_FACTOR,
  FRICTION_FACTOR,
  CONTAINER_INSET,
} from "../constants";

export function applyMovement(items: Item[]) {
  for (const item of items) {
    if (item.mergeCooldown && item.mergeCooldown > 0) {
      item.mergeCooldown--;
    }

    item.velocityY += GRAVITY_ACCELERATION;
    item.positionX += item.velocityX;
    item.positionY += item.velocityY;
    item.velocityX *= FRICTION_FACTOR;
    item.velocityY *= FRICTION_FACTOR;

    // Walls
    if (item.positionX - item.radius < CONTAINER_INSET) {
      item.positionX = CONTAINER_INSET + item.radius;
      item.velocityX = Math.abs(item.velocityX) * WALL_BOUNCE_FACTOR;
      // Settle if velocity is very small
      if (Math.abs(item.velocityX) < 0.5) item.velocityX = 0;
    } else if (item.positionX + item.radius > CANVAS_WIDTH - CONTAINER_INSET) {
      item.positionX = CANVAS_WIDTH - CONTAINER_INSET - item.radius;
      item.velocityX = -Math.abs(item.velocityX) * WALL_BOUNCE_FACTOR;
      if (Math.abs(item.velocityX) < 0.5) item.velocityX = 0;
    }

    // Floor
    if (item.positionY + item.radius > CANVAS_HEIGHT - CONTAINER_INSET) {
      item.positionY = CANVAS_HEIGHT - CONTAINER_INSET - item.radius;
      item.velocityY = -Math.abs(item.velocityY) * FLOOR_BOUNCE_FACTOR;
      item.velocityX *= 0.98;
      // Settle if both velocities are very small
      if (Math.abs(item.velocityY) < 0.5 && Math.abs(item.velocityX) < 0.5) {
        item.velocityY = 0;
        item.velocityX = 0;
      }
    }
  }
}