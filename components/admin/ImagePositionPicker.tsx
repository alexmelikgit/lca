'use client';

import { useRef, useCallback } from 'react';

interface Props {
  src: string;
  position: string;
  onPositionChange: (pos: string) => void;
  containerStyle: React.CSSProperties;
  children?: React.ReactNode;
}

function parsePosition(pos: string): { x: number; y: number } {
  const named: Record<string, number> = { left: 0, center: 50, right: 100, top: 0, bottom: 100 };
  const parts = pos.trim().split(/\s+/);
  const parse = (v: string) => {
    if (v in named) return named[v];
    return parseFloat(v) || 50;
  };
  return { x: parse(parts[0] ?? '50'), y: parse(parts[1] ?? '50') };
}

export default function ImagePositionPicker({ src, position, onPositionChange, containerStyle, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)));
    onPositionChange(`${x}% ${y}%`);
  }, [onPositionChange]);

  const { x, y } = parsePosition(position);

  if (!src) {
    return (
      <div style={{
        ...containerStyle,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #E8F5E4, #F5EBE0)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ opacity: 0.25, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#8B5E3C' }} />
          <div style={{ width: '60px', height: '16px', borderRadius: '4px', background: '#8B5E3C', opacity: 0.5 }} />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ ...containerStyle, position: 'relative', overflow: 'hidden', cursor: 'crosshair', userSelect: 'none' }}
      onMouseDown={(e) => updateFromEvent(e.clientX, e.clientY)}
      onMouseMove={(e) => { if (e.buttons === 1) updateFromEvent(e.clientX, e.clientY); }}
      onTouchStart={(e) => { e.preventDefault(); updateFromEvent(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchMove={(e) => { e.preventDefault(); updateFromEvent(e.touches[0].clientX, e.touches[0].clientY); }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Preview"
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, display: 'block', pointerEvents: 'none' }}
      />

      {/* Crosshair lines */}
      <div style={{ position: 'absolute', left: `${x}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.45)', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: `${y}%`, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.45)', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Focal point dot */}
      <div style={{
        position: 'absolute',
        left: `${x}%`, top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: '18px', height: '18px',
        borderRadius: '50%',
        border: '2px solid white',
        boxShadow: '0 0 0 1.5px rgba(0,0,0,0.55)',
        background: 'rgba(255,255,255,0.2)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {children}
    </div>
  );
}
