import React from 'react';

const CONFIG = {
  critical: { label: 'CRITICAL', classes: 'bg-error/15 border-error/40 text-error', dot: 'bg-error pulse-threat' },
  high: { label: 'HIGH', classes: 'bg-warning/15 border-warning/40 text-warning', dot: 'bg-warning' },
  medium: { label: 'MEDIUM', classes: 'bg-accent/15 border-accent/40 text-accent', dot: 'bg-accent' },
  low: { label: 'LOW', classes: 'bg-muted/50 border-border text-muted-foreground', dot: 'bg-muted-foreground' },
};

export default function SeverityBadge({ severity, size = 'sm' }) {
  const cfg = CONFIG?.[severity] || CONFIG?.low;
  const textSize = size === 'xs' ? 'text-xs' : 'text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-caption font-700 uppercase tracking-wider ${textSize} ${cfg?.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg?.dot}`} />
      {cfg?.label}
    </span>
  );
}