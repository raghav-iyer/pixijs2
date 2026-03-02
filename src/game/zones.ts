import type { ZoneId } from './types';

interface ZoneBounds {
  id: NonNullable<ZoneId>;
  x: number;  // normalized 0-1
  y: number;
  w: number;
  h: number;
}

// 2x2 office grid zones in normalized coordinates
// Based on collision data analysis:
// - Vertical divider ~x=0.52, horizontal divider ~y=0.55
// - Upper-left: Tech, Upper-right: CEO
// - Lower-left: Language, Lower-right: Toilet
export const ZONE_BOUNDS: ZoneBounds[] = [
  { id: 'tech',     x: 0.04, y: 0.13, w: 0.36, h: 0.33 },
  { id: 'ceo',      x: 0.60, y: 0.18, w: 0.35, h: 0.25 },
  { id: 'language',  x: 0.04, y: 0.58, w: 0.46, h: 0.34 },
  { id: 'toilet',   x: 0.64, y: 0.56, w: 0.32, h: 0.36 },
];

export function detectZone(
  playerX: number,
  playerY: number,
  canvasWidth: number,
  canvasHeight: number,
): NonNullable<ZoneId> | null {
  const nx = playerX / canvasWidth;
  const ny = playerY / canvasHeight;

  for (const zone of ZONE_BOUNDS) {
    if (
      nx >= zone.x &&
      nx <= zone.x + zone.w &&
      ny >= zone.y &&
      ny <= zone.y + zone.h
    ) {
      return zone.id;
    }
  }
  return null;
}
