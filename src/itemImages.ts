import { ITEM_IMAGE_MAP } from "./itemImageMap";

export const itemImages: HTMLImageElement[] = ITEM_IMAGE_MAP.map((src) => {
  const img = new window.Image();
  img.src = src;
  return img;
});