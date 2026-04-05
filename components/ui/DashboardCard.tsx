'use client';

import React from 'react';

/**
 * DashboardCard — a floating mini dashboard mockup used in the Hero section.
 * Displays plot name, status, crops, a 2×2 stats grid, a progress bar,
 * and the next delivery info. Fully driven by props so it can be reused
 * in other contexts (e.g. the Dashboard section full mockup).
 */

export interface DashboardCardStats {
  plotSize: string;
  seasonWeek: string;
  estimatedYield: string;
  harvestDate: string;
}

export interface DashboardCardProps {
  plotName: string;
  status: string;
  crops: string[];
  stats: DashboardCardStats;
  progress: {
    label: string;
    percentage: number;
  };
  nextDelivery: {
    day: string;
    description: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

export default function DashboardCard({
  plotName,
  status,
  crops,
  stats,
  progress,
  nextDelivery,
  className = '',
  style,
}: DashboardCardProps) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--cream)',
        border: '1px solid rgba(168,212,160,0.3)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
        width: '280px',
        fontFamily: 'var(--font-lato)',
        ...style,
      }}
    >
      {/* Card header */}
      <div
        style={{
          background: 'var(--green-deep)',
          padding: '12px 16px 10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              color: 'var(--gold-light)',
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            My Plot
          </span>
          {/* Status badge */}
          <span
            style={{
              background: 'rgba(168,212,160,0.2)',
              color: 'var(--green-light)',
              border: '1px solid rgba(168,212,160,0.35)',
              borderRadius: '20px',
              padding: '2px 10px',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            {status}
          </span>
        </div>
        <div
          style={{
            color: 'white',
            fontFamily: 'var(--font-playfair)',
            fontWeight: 400,
            fontSize: '1.05rem',
            marginTop: '4px',
          }}
        >
          {plotName}
        </div>
      </div>

      {/* Crop pills */}
      <div
        style={{
          padding: '10px 16px 8px',
          borderBottom: '1px solid var(--green-pale)',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
        }}
      >
        {crops.map((crop) => (
          <span
            key={crop}
            style={{
              background: 'var(--green-pale)',
              color: 'var(--green-deep)',
              border: '1px solid var(--green-light)',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            {crop}
          </span>
        ))}
      </div>

      {/* 2×2 stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0',
          borderBottom: '1px solid var(--green-pale)',
        }}
      >
        {[
          { label: 'Plot size', value: stats.plotSize },
          { label: 'Season week', value: stats.seasonWeek },
          { label: 'Est. yield', value: stats.estimatedYield },
          { label: 'Harvest date', value: stats.harvestDate },
        ].map((item, i) => (
          <div
            key={item.label}
            style={{
              padding: '8px 12px',
              borderRight: i % 2 === 0 ? '1px solid var(--green-pale)' : 'none',
              borderBottom: i < 2 ? '1px solid var(--green-pale)' : 'none',
            }}
          >
            <div
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink3)',
                marginBottom: '2px',
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ padding: '10px 16px 8px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}
        >
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--ink2)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {progress.label}
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--green)',
            }}
          >
            {progress.percentage}%
          </span>
        </div>
        {/* Track */}
        <div
          style={{
            height: '5px',
            background: 'var(--green-pale)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress.percentage}%`,
              background: `linear-gradient(90deg, var(--green-mid), var(--green))`,
              borderRadius: '10px',
              transition: 'width 1s ease',
            }}
          />
        </div>
      </div>

      {/* Next delivery */}
      <div
        style={{
          padding: '8px 16px 12px',
          background: 'var(--gold-pale)',
          borderTop: '1px solid rgba(196,154,60,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>📦</span>
        <div>
          <div
            style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--soil)',
              marginBottom: '1px',
            }}
          >
            Next delivery
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'var(--ink2)',
            }}
          >
            <strong style={{ fontWeight: 700 }}>{nextDelivery.day}</strong>{' '}
            · {nextDelivery.description}
          </div>
        </div>
      </div>
    </div>
  );
}
