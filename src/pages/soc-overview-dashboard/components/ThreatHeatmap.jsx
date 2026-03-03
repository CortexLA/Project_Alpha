import React, { useState, useEffect, useCallback } from "react";


const REGIONS = [
  { id: 1, name: "North America", x: 18, y: 32, threats: 14, severity: "high", active: true },
  { id: 2, name: "Europe", x: 46, y: 24, threats: 8, severity: "medium", active: true },
  { id: 3, name: "Asia Pacific", x: 72, y: 35, threats: 21, severity: "critical", active: true },
  { id: 4, name: "South America", x: 28, y: 62, threats: 3, severity: "low", active: false },
  { id: 5, name: "Middle East", x: 57, y: 40, threats: 6, severity: "medium", active: true },
  { id: 6, name: "Africa", x: 48, y: 55, threats: 2, severity: "low", active: false },
  { id: 7, name: "Southeast Asia", x: 76, y: 50, threats: 9, severity: "high", active: true },
];

const ACTIVITY_LINES = [
  { x1: 18, y1: 32, x2: 46, y2: 24 },
  { x1: 46, y1: 24, x2: 72, y2: 35 },
  { x1: 18, y1: 32, x2: 57, y2: 40 },
  { x1: 72, y1: 35, x2: 76, y2: 50 },
];

const severityConfig = {
  critical: { color: "#EF4444", size: 18, pulseColor: "rgba(239,68,68,0.4)" },
  high: { color: "#F59E0B", size: 14, pulseColor: "rgba(245,158,11,0.4)" },
  medium: { color: "#3B82F6", size: 11, pulseColor: "rgba(59,130,246,0.3)" },
  low: { color: "#10B981", size: 8, pulseColor: "rgba(16,185,129,0.3)" },
};

export default function ThreatHeatmap({ onRegionClick }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 1) % 60);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getOpacity = useCallback((regionId) => {
    const offset = (regionId * 10 + pulsePhase) % 60;
    return 0.3 + 0.7 * Math.abs(Math.sin((offset / 60) * Math.PI));
  }, [pulsePhase]);

  return (
    <div className="relative w-full h-full bg-[var(--color-surface-1)] rounded-lg border border-[var(--color-border)] overflow-hidden">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* SVG Map */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet">
        {/* Activity lines */}
        {ACTIVITY_LINES?.map((line, i) => (
          <line
            key={i}
            x1={line?.x1} y1={line?.y1} x2={line?.x2} y2={line?.y2}
            stroke="#3B82F6"
            strokeWidth="0.3"
            strokeDasharray="1 1"
            opacity="0.4"
          />
        ))}

        {/* Region markers */}
        {REGIONS?.map((region) => {
          const cfg = severityConfig?.[region?.severity];
          const r = cfg?.size / 10;
          const isHovered = hoveredRegion === region?.id;
          return (
            <g key={region?.id}>
              {/* Pulse ring */}
              {region?.active && (
                <circle
                  cx={region?.x}
                  cy={region?.y}
                  r={r * 2.5}
                  fill="none"
                  stroke={cfg?.color}
                  strokeWidth="0.3"
                  opacity={getOpacity(region?.id) * 0.6}
                />
              )}
              {/* Outer glow */}
              <circle
                cx={region?.x}
                cy={region?.y}
                r={r * 1.8}
                fill={cfg?.color}
                opacity={0.15}
              />
              {/* Main dot */}
              <circle
                cx={region?.x}
                cy={region?.y}
                r={r}
                fill={cfg?.color}
                opacity={isHovered ? 1 : 0.85}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredRegion(region?.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => onRegionClick && onRegionClick(region)}
              />
              {/* Threat count label */}
              {isHovered && (
                <text
                  x={region?.x + r + 0.5}
                  y={region?.y - r - 0.5}
                  fontSize="2.5"
                  fill={cfg?.color}
                  fontFamily="monospace"
                >
                  {region?.name}: {region?.threats}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 bg-[var(--color-surface-0)]/80 backdrop-blur-sm rounded-md p-2 border border-[var(--color-border)]">
        {Object.entries(severityConfig)?.map(([sev, cfg]) => (
          <div key={sev} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg?.color }} />
            <span className="font-caption text-xs text-[var(--color-muted-foreground)] capitalize">{sev}</span>
          </div>
        ))}
      </div>
      {/* Active incidents counter */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-md px-2 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
        <span className="font-data text-xs text-[#EF4444]">5 Active Incidents</span>
      </div>
      {/* Tooltip */}
      {hoveredRegion && (() => {
        const region = REGIONS?.find(r => r?.id === hoveredRegion);
        if (!region) return null;
        const cfg = severityConfig?.[region?.severity];
        return (
          <div
            className="absolute z-10 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg pointer-events-none"
            style={{ left: `${region?.x}%`, top: `${region?.y}%`, transform: "translate(-50%, -120%)" }}
          >
            <p className="font-heading text-xs text-[var(--color-card-foreground)] mb-1">{region?.name}</p>
            <div className="flex items-center gap-2">
              <span className="font-data text-sm font-600" style={{ color: cfg?.color }}>{region?.threats}</span>
              <span className="font-caption text-xs text-[var(--color-muted-foreground)]">threats</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg?.color }} />
              <span className="font-caption text-xs capitalize" style={{ color: cfg?.color }}>{region?.severity}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}