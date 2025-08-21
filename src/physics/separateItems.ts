import type { Item } from "../types";

export function separateItems(items: Item[]) {
  let separated = true;
  let separationIterations = 0;
  const SEPARATION_ITERATION_LIMIT = 1000;

  while (separated && separationIterations < SEPARATION_ITERATION_LIMIT) {
    separated = false;
    separationIterations++;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const itemA = items[i];
        const itemB = items[j];
        const deltaX = itemB.positionX - itemA.positionX;
        const deltaY = itemB.positionY - itemA.positionY;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;
        const minDistance = itemA.radius + itemB.radius;
        if (distanceSquared > 0 && distanceSquared < minDistance * minDistance) {
          const distance = Math.sqrt(distanceSquared);
          const normX = deltaX / distance;
          const normY = deltaY / distance;
          const overlap = minDistance - distance;

          // Weight is proportional to radius (or radius squared for more effect)
          const weightA = itemA.radius * itemA.radius;
          const weightB = itemB.radius * itemB.radius;
          const totalWeight = weightA + weightB;

          // Distribute separation based on weight (heavier moves less)
          const moveA = (weightB / totalWeight) * overlap;
          const moveB = (weightA / totalWeight) * overlap;

          itemA.positionX -= normX * moveA;
          itemA.positionY -= normY * moveA;
          itemB.positionX += normX * moveB;
          itemB.positionY += normY * moveB;

          // Calculate relative velocity along the collision normal
          const relVelX = itemB.velocityX - itemA.velocityX;
          const relVelY = itemB.velocityY - itemA.velocityY;
          const relVelAlongNormal = relVelX * normX + relVelY * normY;

          // Only apply bounce if items are moving toward each other
          const bounceStrength = 1.2; // Try 1.2 or higher for more effect
          if (relVelAlongNormal < -0.1) {
            itemA.velocityX -= normX * bounceStrength * (weightB / totalWeight);
            itemA.velocityY -= normY * bounceStrength * (weightB / totalWeight);
            itemB.velocityX += normX * bounceStrength * (weightA / totalWeight);
            itemB.velocityY += normY * bounceStrength * (weightA / totalWeight);
          }

          // Dampen velocities for both items
          itemA.velocityX *= 0.8;
          itemA.velocityY *= 0.8;
          itemB.velocityX *= 0.8;
          itemB.velocityY *= 0.8;

          // Settle if both velocities are very small
          if (Math.abs(itemA.velocityX) < 0.5) itemA.velocityX = 0;
          if (Math.abs(itemA.velocityY) < 0.5) itemA.velocityY = 0;
          if (Math.abs(itemB.velocityX) < 0.5) itemB.velocityX = 0;
          if (Math.abs(itemB.velocityY) < 0.5) itemB.velocityY = 0;
          separated = true;

          // Stable stacking for different levels
          if (itemA.level !== itemB.level) {
            if (Math.abs(itemA.positionY - itemB.positionY) > Math.abs(itemA.positionX - itemB.positionX)) {
              if (itemA.positionY > itemB.positionY) {
                itemA.velocityY = Math.min(itemA.velocityY, 0);
                itemB.velocityY = Math.max(itemB.velocityY, 0);
              } else {
                itemA.velocityY = Math.max(itemA.velocityY, 0);
                itemB.velocityY = Math.min(itemB.velocityY, 0);
              }
              const roll = 0.1 * (Math.random() - 0.5);
              itemA.velocityX += roll;
              itemB.velocityX -= roll;
            }
          }
        } else if (distanceSquared === 0) {
          const angle = (Math.random() + i) * 2 * Math.PI;
          const nudge = minDistance * 0.5;
          itemA.positionX += Math.cos(angle) * nudge;
          itemA.positionY += Math.sin(angle) * nudge;
          itemB.positionX -= Math.cos(angle) * nudge;
          itemB.positionY -= Math.sin(angle) * nudge;
          itemA.velocityX += Math.cos(angle) * 0.5;
          itemB.velocityX -= Math.cos(angle) * 0.5;
          separated = true;
        }
      }
    }
  }
}