import normalizedBoxes from "./collision-data.json";

export interface CollisionBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function getCollisionBoxes(canvasW: number, canvasH: number): CollisionBox[] {
  return normalizedBoxes.map((b: { x: number; y: number; w: number; h: number }) => ({
    x: b.x * canvasW,
    y: b.y * canvasH,
    w: b.w * canvasW,
    h: b.h * canvasH,
  }));
}

/** AABB overlap test */
export function overlaps(
  px: number,
  py: number,
  pw: number,
  ph: number,
  box: CollisionBox
): boolean {
  return px < box.x + box.w && px + pw > box.x && py < box.y + box.h && py + ph > box.y;
}
