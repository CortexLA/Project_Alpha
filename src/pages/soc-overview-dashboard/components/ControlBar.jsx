import React from "react";
import Icon from "components/AppIcon";

const TIME_RANGES = ["1hr", "6hr", "24hr", "7d", "30d"];
const ENVIRONMENTS = ["All Environments", "Production", "Staging", "Development", "DMZ"];
const REFRESH_INTERVALS = [
  { label: "5s", value: 5000 },
  { label: "15s", value: 15000 },
  { label: "30s", value: 30000 },
  { label: "Off", value: 0 },
];

export default function ControlBar({
  timeRange, setTimeRange,
  environment, setEnvironment,
  refreshInterval, setRefreshInterval,
  lastRefresh, isLive,
  onExport,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3 px-4 md:px-6 py-3 bg-[var(--color-card)] border-b border-[var(--color-border)]">
      {/* Time range */}
      <div className="flex items-center gap-1 bg-[var(--color-surface-0)] rounded-md p-1 border border-[var(--color-border)]">
        {TIME_RANGES?.map(t => (
          <button
            key={t}
            onClick={() => setTimeRange(t)}
            className={`px-2.5 py-1 rounded font-data text-xs transition-all duration-200 ${
              timeRange === t
                ? "bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-[var(--color-primary)]"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-card-foreground)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Environment filter */}
      <div className="relative">
        <select
          value={environment}
          onChange={e => setEnvironment(e?.target?.value)}
          className="appearance-none bg-[var(--color-surface-0)] border border-[var(--color-border)] rounded-md px-3 py-1.5 pr-7 font-caption text-xs text-[var(--color-card-foreground)] focus:outline-none focus:border-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
        >
          {ENVIRONMENTS?.map(env => (
            <option key={env} value={env} className="bg-[var(--color-card)]">{env}</option>
          ))}
        </select>
        <Icon name="ChevronDown" size={12} color="var(--color-muted-foreground)" className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {/* Auto-refresh */}
      <div className="flex items-center gap-1.5 bg-[var(--color-surface-0)] rounded-md p-1 border border-[var(--color-border)]">
        <Icon name="RefreshCw" size={12} color="var(--color-muted-foreground)" className="ml-1" />
        {REFRESH_INTERVALS?.map(r => (
          <button
            key={r?.label}
            onClick={() => setRefreshInterval(r?.value)}
            className={`px-2 py-1 rounded font-data text-xs transition-all duration-200 ${
              refreshInterval === r?.value
                ? "bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-[var(--color-primary)]"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-card-foreground)]"
            }`}
          >
            {r?.label}
          </button>
        ))}
      </div>
      {/* Live indicator */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--color-surface-0)] border border-[var(--color-border)]">
        <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-[#10B981] animate-pulse" : "bg-[#EF4444]"}`} />
        <span className="font-data text-xs text-[var(--color-muted-foreground)]">
          {isLive ? `Updated ${lastRefresh}` : "Paused"}
        </span>
      </div>
      {/* Export */}
      <button
        onClick={onExport}
        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 font-caption text-xs text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-all duration-200 active:scale-95"
      >
        <Icon name="Download" size={13} color="var(--color-primary)" />
        <span className="hidden sm:inline">Export PDF</span>
      </button>
    </div>
  );
}