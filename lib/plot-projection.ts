/**
 * plot-projection.ts
 * Linear projection of GPS coordinates to pixel coordinates on a static satellite image.
 *
 * APPROXIMATION NOTE: This uses simple linear interpolation (not Mercator projection).
 * At field scale (<500m), the error is sub-pixel and acceptable for MVP.
 * For larger areas, use a proper Mercator projection.
 */

import type { LatLng } from '@/lib/plot-grid';

export interface ImageBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface PixelPoint {
  x: number;
  y: number;
}

/**
 * Project a GPS coordinate to pixel position on the static satellite image.
 * @param point  GPS coordinate to project
 * @param bounds Bounding box of the satellite image (must match image exactly)
 * @param width  Image width in pixels
 * @param height Image height in pixels
 */
export function projectToPixel(
  point: LatLng,
  bounds: ImageBounds,
  width: number,
  height: number,
): PixelPoint {
  const x = ((point.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width;
  // Latitude increases upward; pixel y increases downward — invert
  const y = ((bounds.maxLat - point.lat) / (bounds.maxLat - bounds.minLat)) * height;
  return { x, y };
}
