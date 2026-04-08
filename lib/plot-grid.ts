/**
 * plot-grid.ts
 * Pure math utilities for generating a grid of plots over an irregular GPS quadrilateral.
 * No React, no UI dependencies.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PlotCell {
  /** "{row}-{col}" — matches plotOverrides key format */
  id: string;
  row: number;
  col: number;
  /** TL, TR, BR, BL */
  corners: [LatLng, LatLng, LatLng, LatLng];
}

const DEG_TO_RAD = Math.PI / 180;
const EARTH_RADIUS_M = 6_371_000;

/** Haversine great-circle distance between two GPS points, in metres. */
export function haversineDistance(a: LatLng, b: LatLng): number {
  const dLat = (b.lat - a.lat) * DEG_TO_RAD;
  const dLng = (b.lng - a.lng) * DEG_TO_RAD;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * DEG_TO_RAD) * Math.cos(b.lat * DEG_TO_RAD) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/**
 * Bilinear interpolation over the quadrilateral.
 * corners order: [TL, TR, BR, BL]
 * u ∈ [0,1]: left→right, v ∈ [0,1]: top→bottom
 */
export function bilinearInterpolate(
  corners: [LatLng, LatLng, LatLng, LatLng],
  u: number,
  v: number,
): LatLng {
  const [tl, tr, br, bl] = corners;
  return {
    lat: (1 - u) * (1 - v) * tl.lat + u * (1 - v) * tr.lat + u * v * br.lat + (1 - u) * v * bl.lat,
    lng: (1 - u) * (1 - v) * tl.lng + u * (1 - v) * tr.lng + u * v * br.lng + (1 - u) * v * bl.lng,
  };
}

/**
 * Generate all plot cells for the given field.
 * corners: [TL, TR, BR, BL] in GPS.
 * Returns one PlotCell per grid position, sorted row-major (top-left first).
 */
export function generatePlotGrid(corners: LatLng[], plotSizeM2: number): PlotCell[] {
  const quad = corners as [LatLng, LatLng, LatLng, LatLng];
  const widthM = haversineDistance(corners[0], corners[1]);
  const heightM = haversineDistance(corners[0], corners[3]);
  const side = Math.sqrt(plotSizeM2);
  const cols = Math.max(1, Math.round(widthM / side));
  const rows = Math.max(1, Math.round(heightM / side));

  const cells: PlotCell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const u0 = col / cols;
      const u1 = (col + 1) / cols;
      const v0 = row / rows;
      const v1 = (row + 1) / rows;
      cells.push({
        id: `${row}-${col}`,
        row,
        col,
        corners: [
          bilinearInterpolate(quad, u0, v0), // TL
          bilinearInterpolate(quad, u1, v0), // TR
          bilinearInterpolate(quad, u1, v1), // BR
          bilinearInterpolate(quad, u0, v1), // BL
        ],
      });
    }
  }
  return cells;
}
