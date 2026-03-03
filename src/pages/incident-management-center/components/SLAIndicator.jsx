import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

function formatTimeLeft(ms) {
  if (ms <= 0) return { label: 'BREACHED', color: 'text-error', bg: 'bg-error/10 border-error/30' };
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 4) return { label: `${h}h ${m}m`, color: 'text-success', bg: 'bg-success/10 border-success/30' };
  if (h > 1) return { label: `${h}h ${m}m`, color: 'text-warning', bg: 'bg-warning/10 border-warning/30' };
  return { label: `${h}h ${m}m`, color: 'text-error', bg: 'bg-error/10 border-error/30' };
}

export default function SLAIndicator({ deadlineMs }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const remaining = deadlineMs - now;
  const { label, color, bg } = formatTimeLeft(remaining);

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-data text-xs font-600 ${bg} ${color}`}>
      <Icon name="Clock" size={11} color="currentColor" />
      {label}
    </span>
  );
}