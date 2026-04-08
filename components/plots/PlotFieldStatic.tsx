'use client';

import { useState, useCallback, useMemo } from 'react';
import type { PlotFieldConfig, PlotStatusValue, DiscountTier } from '@/types/content';
import { generatePlotGrid } from '@/lib/plot-grid';
import { projectToPixel } from '@/lib/plot-projection';

interface Props {
  fieldConfig: PlotFieldConfig;
  reserveCtaText: string;
  reserveCtaHref: string;
}

const STATUS_STYLES: Record<PlotStatusValue, {
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeOpacity: number;
  hoverFillOpacity: number;
}> = {
  available: {
    fill: '#FFFFFF',
    fillOpacity: 0.06,
    stroke: '#C49A3C',
    strokeOpacity: 0.5,
    hoverFillOpacity: 0.32,
  },
  sold: {
    fill: '#E84060',
    fillOpacity: 0.45,
    stroke: '#E84060',
    strokeOpacity: 0.85,
    hoverFillOpacity: 0.65,
  },
  reserved: {
    fill: '#C49A3C',
    fillOpacity: 0.35,
    stroke: '#C49A3C',
    strokeOpacity: 0.85,
    hoverFillOpacity: 0.6,
  },
};

const STATUS_LABELS: Record<PlotStatusValue, string> = {
  available: 'Available',
  sold: 'Sold',
  reserved: 'Reserved',
};

function getPlotStatus(id: string, config: PlotFieldConfig): PlotStatusValue {
  const override = config.plotOverrides[id];
  if (override?.status) return override.status;
  return config.defaultStatus as PlotStatusValue;
}

function getPlotPrice(id: string, config: PlotFieldConfig): number {
  const override = config.plotOverrides[id];
  return override?.priceOverrideUSD ?? config.defaultPriceUSD;
}

function getDiscountPercent(count: number, tiers?: DiscountTier[]): number {
  if (!tiers || count < 2) return 0;
  let best = 0;
  for (const t of tiers) {
    if (count >= t.minPlots && t.percent > best) best = t.percent;
  }
  return best;
}

export default function PlotFieldStatic({ fieldConfig, reserveCtaText, reserveCtaHref }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const activeId = hoveredId;

  // Generate plot grid once (expensive math, memoized)
  const plotCells = useMemo(
    () => generatePlotGrid(fieldConfig.fieldCorners, fieldConfig.plotSizeM2),
    [fieldConfig.fieldCorners, fieldConfig.plotSizeM2],
  );

  // Project all cell corners to pixel coordinates once
  const projectedCells = useMemo(
    () =>
      plotCells.map((cell) => ({
        ...cell,
        pixelCorners: cell.corners.map((c) =>
          projectToPixel(c, fieldConfig.imageBounds, fieldConfig.imageWidth, fieldConfig.imageHeight),
        ),
      })),
    [plotCells, fieldConfig.imageBounds, fieldConfig.imageWidth, fieldConfig.imageHeight],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const target = (e.target as SVGElement).closest<SVGElement>('[data-id]');
      const id = target?.dataset.id ?? null;
      setHoveredId(id);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => setHoveredId(null), []);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const target = (e.target as SVGElement).closest<SVGElement>('[data-id]');
    const id = target?.dataset.id ?? null;
    if (!id) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 12) next.add(id);
      return next;
    });
  }, []);

  const activeStatus = activeId ? getPlotStatus(activeId, fieldConfig) : null;
  const activePrice = activeId ? getPlotPrice(activeId, fieldConfig) : null;
  const activeDesc = activeId ? fieldConfig.plotOverrides[activeId]?.shortDescription ?? null : null;
  const activeCurrency = fieldConfig.currency === 'USD' ? '$' : fieldConfig.currency;

  // Multi-selection totals
  const selectionArray = useMemo(() => Array.from(selectedIds), [selectedIds]);
  const selectionCount = selectionArray.length;
  const totalArea = selectionCount * fieldConfig.plotSizeM2;
  const totalPrice = useMemo(
    () => selectionArray.reduce((sum, id) => sum + getPlotPrice(id, fieldConfig), 0),
    [selectionArray, fieldConfig],
  );
  const allSelectedAvailable = useMemo(
    () => selectionArray.every((id) => getPlotStatus(id, fieldConfig) === 'available'),
    [selectionArray, fieldConfig],
  );

  const discountPercent = getDiscountPercent(selectionCount, fieldConfig.discountTiers);
  const discountedTotal = Math.round(totalPrice * (1 - discountPercent / 100) * 100) / 100;
  const savings = Math.round((totalPrice - discountedTotal) * 100) / 100;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* CSS for polygon hover states — avoids JS-driven re-renders per hover frame */}
      <style>{`
        .plot-poly {
          cursor: pointer;
          transition: fill-opacity 0.12s ease;
        }
        .plot-poly:hover {
          fill-opacity: var(--hover-opacity) !important;
        }
        .plot-poly[data-selected="true"] {
          fill-opacity: var(--hover-opacity) !important;
          stroke-opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .plot-poly:hover {
            fill-opacity: var(--fill-opacity) !important;
          }
          .plot-info-overlay {
            display: none !important;
          }
          .plot-info-mobile {
            display: flex !important;
          }
        }
      `}</style>

      {/* Satellite image + SVG overlay container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${fieldConfig.imageWidth} / ${fieldConfig.imageHeight}`,
          borderRadius: '14px',
          overflow: 'hidden',
          background: '#1A2E1B',
        }}
      >
        {/* Satellite image background */}
        <img
          src={fieldConfig.imagePath}
          alt="Field satellite view"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
          }}
          // If image is missing, the dark background shows through
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Subtle vignette overlay for premium feel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(10,20,11,0.45) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* SVG plot grid — event delegation on root */}
        <svg
          viewBox={`0 0 ${fieldConfig.imageWidth} ${fieldConfig.imageHeight}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 3,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {projectedCells.map((cell) => {
            const status = getPlotStatus(cell.id, fieldConfig);
            const s = STATUS_STYLES[status];
            const points = cell.pixelCorners.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
            const isSelected = selectedIds.has(cell.id);
            return (
              <polygon
                key={cell.id}
                className="plot-poly"
                data-id={cell.id}
                data-selected={isSelected ? 'true' : undefined}
                points={points}
                fill={s.fill}
                fillOpacity={isSelected ? 0.55 : s.fillOpacity}
                stroke={isSelected ? '#FFE066' : s.stroke}
                strokeWidth={isSelected ? '1.8' : '0.7'}
                strokeOpacity={isSelected ? 1 : s.strokeOpacity}
                style={{
                  '--fill-opacity': s.fillOpacity,
                  '--hover-opacity': s.hoverFillOpacity,
                } as React.CSSProperties}
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'rgba(10, 18, 10, 0.82)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px',
          padding: '10px 14px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
        }}>
          {(Object.entries(STATUS_STYLES) as Array<[PlotStatusValue, typeof STATUS_STYLES[PlotStatusValue]]>).map(
            ([key, s]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '11px',
                  height: '11px',
                  borderRadius: '2px',
                  flexShrink: 0,
                  background: s.fill,
                  opacity: s.fillOpacity + 0.3,
                  border: `1.5px solid ${s.stroke}`,
                  display: 'block',
                }} />
                <span style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 400,
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'capitalize',
                  color: 'rgba(255,255,255,0.7)',
                }}>
                  {STATUS_LABELS[key]}
                </span>
              </div>
            ),
          )}
        </div>

        {/* Info panel — desktop overlay (hidden on mobile via CSS) */}
        {(selectionCount > 0 || (activeId && activeStatus)) && (
          <div
            className="plot-info-overlay"
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              background: 'rgba(10, 18, 10, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '14px 18px',
              zIndex: 10,
              minWidth: '200px',
              maxWidth: '280px',
              pointerEvents: selectionCount > 0 ? 'auto' : 'none',
            }}
          >
            {selectionCount > 0 ? (
              /* ── Multi-selection totals ── */
              <>
                <div style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.38)',
                  marginBottom: '10px',
                }}>
                  {selectionCount} plot{selectionCount > 1 ? 's' : ''} selected
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-lato)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>Area</div>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '1.1rem', color: 'white' }}>
                      {totalArea} m²
                    </div>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
                    <div style={{ fontFamily: 'var(--font-lato)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>Total</div>
                    {discountPercent > 0 ? (
                      <div>
                        <span style={{ fontFamily: 'var(--font-lato)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', marginRight: '5px' }}>
                          {activeCurrency}{totalPrice}
                        </span>
                        <span style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '1.1rem', color: '#C49A3C' }}>
                          {activeCurrency}{discountedTotal.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span style={{ fontSize: '0.65em', opacity: 0.7, marginLeft: '3px' }}>/mo</span>
                        </span>
                        <div style={{ marginTop: '3px', fontFamily: 'var(--font-lato)', fontSize: '0.6rem', color: '#A8D4A0', letterSpacing: '0.06em' }}>
                          −{discountPercent}% · save {activeCurrency}{savings.toFixed(2)}/mo
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '1.1rem', color: '#C49A3C' }}>
                        {activeCurrency}{totalPrice.toLocaleString()}<span style={{ fontSize: '0.65em', opacity: 0.7, marginLeft: '3px' }}>/mo</span>
                      </div>
                    )}
                  </div>
                </div>

                {allSelectedAvailable && (
                  <a
                    href={reserveCtaHref}
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-lato)',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#C49A3C',
                      border: '1px solid rgba(196,154,60,0.45)',
                      borderRadius: '100px',
                      padding: '7px 16px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLAnchorElement).style.background = 'rgba(196,154,60,0.12)';
                      (e.target as HTMLAnchorElement).style.borderColor = 'rgba(196,154,60,0.7)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLAnchorElement).style.background = 'transparent';
                      (e.target as HTMLAnchorElement).style.borderColor = 'rgba(196,154,60,0.45)';
                    }}
                  >
                    {reserveCtaText} →
                  </a>
                )}
              </>
            ) : (
              /* ── Single plot hover preview ── */
              activeId && activeStatus && (
                <>
                  <div style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.38)',
                    marginBottom: '8px',
                  }}>
                    Plot {activeId}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: activePrice && activeStatus === 'available' ? '10px' : '0' }}>
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: STATUS_STYLES[activeStatus].stroke, flexShrink: 0, display: 'block',
                    }} />
                    <span style={{ fontFamily: 'var(--font-lato)', fontWeight: 600, fontSize: '0.85rem', color: 'white' }}>
                      {STATUS_LABELS[activeStatus]}
                    </span>
                  </div>

                  {activeDesc && (
                    <p style={{ fontFamily: 'var(--font-lato)', fontWeight: 300, fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '6px 0 10px' }}>
                      {activeDesc}
                    </p>
                  )}

                  {activeStatus === 'available' && activePrice !== null && (
                    <div style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '1.15rem', color: '#C49A3C' }}>
                      {activeCurrency}{activePrice.toLocaleString()}<span style={{ fontSize: '0.7em', opacity: 0.7, marginLeft: '3px' }}>/mo</span>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        )}
      </div>

      {/* Mobile info bar — shown below the map on small screens */}
      {selectionCount > 0 && (
        <div
          className="plot-info-mobile"
          style={{
            display: 'none', // shown via CSS on mobile
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginTop: '10px',
            background: 'rgba(10, 18, 10, 0.92)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-lato)', fontWeight: 600, fontSize: '0.82rem', color: 'white', whiteSpace: 'nowrap' }}>
              {selectionCount} plot{selectionCount > 1 ? 's' : ''} · {totalArea} m²
            </span>
            {discountPercent > 0 ? (
              <>
                <span style={{ fontFamily: 'var(--font-lato)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through', whiteSpace: 'nowrap' }}>
                  {activeCurrency}{totalPrice}
                </span>
                <span style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '1rem', color: '#C49A3C', whiteSpace: 'nowrap' }}>
                  {activeCurrency}{discountedTotal.toFixed(2)}<span style={{ fontSize: '0.7em', opacity: 0.7, marginLeft: '3px' }}>/mo</span>
                </span>
                <span style={{ fontFamily: 'var(--font-lato)', fontSize: '0.65rem', color: '#A8D4A0', whiteSpace: 'nowrap' }}>
                  −{discountPercent}%
                </span>
              </>
            ) : (
              <span style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '1rem', color: '#C49A3C', whiteSpace: 'nowrap' }}>
                {activeCurrency}{totalPrice.toLocaleString()}<span style={{ fontSize: '0.7em', opacity: 0.7, marginLeft: '3px' }}>/mo</span>
              </span>
            )}
          </div>
          {allSelectedAvailable && (
            <a
              href={reserveCtaHref}
              style={{
                flexShrink: 0,
                fontFamily: 'var(--font-lato)', fontWeight: 700,
                fontSize: '0.7rem', letterSpacing: '0.08em',
                textTransform: 'uppercase', color: '#C49A3C',
                border: '1px solid rgba(196,154,60,0.45)',
                borderRadius: '100px', padding: '6px 14px',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              {reserveCtaText} →
            </a>
          )}
        </div>
      )}

      {/* Plot count summary */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        gap: '20px',
        fontFamily: 'var(--font-lato)',
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.38)',
        letterSpacing: '0.06em',
      }}>
        <span>{plotCells.length} total plots · {fieldConfig.plotSizeM2} sqm each</span>
      </div>
    </div>
  );
}
