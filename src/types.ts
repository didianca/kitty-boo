export type Item = {
  id: number;
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  level: number;
  settled?: boolean;
  mergeCooldown?: number;
};
