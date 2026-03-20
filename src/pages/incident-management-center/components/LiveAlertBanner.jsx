import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const LIVE_ALERTS = [
  { id: 1, msg: 'CRITICAL: Brute force attack detected on WKSTN-042 — 847 failed attempts in 3 minutes', severity: 'critical' },
  { id: 2, msg: 'HIGH: Privilege escalation attempt by jsmith@corp.com — accessing restricted admin endpoints', severity: 'high' },
  { id: 3, msg: 'CRITICAL: Unusual data exfiltration detected — 2.3GB transferred to external IP 185.220.101.45', severity: 'critical' },
];

export default function LiveAlertBanner() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCurrentIdx(i => (i + 1) % LIVE_ALERTS?.length), 5000);
    return () => clearInterval(t);
  }, []);

  if (!visible) return null;

  const alert = LIVE_ALERTS?.[currentIdx];
  const isCritical = alert?.severity === 'critical';

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${isCritical ? 'bg-error/10 border-error/30' : 'bg-warning/10 border-warning/30'} relative overflow-hidden`}>
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isCritical ? 'bg-error/20 pulse-threat' : 'bg-warning/20'}`}>
        <Icon name="Zap" size={13} color={isCritical ? 'var(--color-error)' : 'var(--color-warning)'} />
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className={`font-caption text-xs font-700 uppercase flex-shrink-0 ${isCritical ? 'text-error' : 'text-warning'}`}>LIVE</span>
        <span className="font-caption text-xs text-[var(--color-foreground)] truncate">{alert?.msg}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-data text-xs text-[var(--color-muted-foreground)]">{currentIdx + 1}/{LIVE_ALERTS?.length}</span>
        <button onClick={() => setVisible(false)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
          <Icon name="X" size={14} color="currentColor" />
        </button>
      </div>
    </div>
  );
}