import React from "react";
import Icon from "components/AppIcon";

const hours = ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const heatmapData = [
  [0, 0, 0, 1, 8, 12, 10, 11, 13, 9, 5, 2],
  [0, 0, 0, 1, 9, 14, 11, 12, 15, 10, 6, 2],
  [0, 0, 0, 2, 7, 11, 9, 10, 12, 8, 4, 1],
  [0, 0, 1, 2, 10, 15, 13, 14, 16, 11, 7, 3],
  [0, 0, 0, 1, 8, 12, 10, 11, 14, 9, 5, 2],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 5],
  [2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 6],
];

const getColor = (value) => {
  if (value === 0) return "bg-[var(--color-surface-2)]";
  if (value <= 3) return "bg-[var(--color-success)]/30";
  if (value <= 7) return "bg-[var(--color-warning)]/40";
  if (value <= 12) return "bg-[var(--color-error)]/50";
  return "bg-[var(--color-error)]/80";
};

const AnomalyHeatmap = () => {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading text-sm text-[var(--color-card-foreground)]">Suspicious Activity Heatmap</h3>
          <p className="font-caption text-xs text-[var(--color-muted-foreground)] mt-0.5">Activity intensity by day and hour — last 7 days</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-caption text-xs text-[var(--color-muted-foreground)]">Low</span>
          {["bg-[var(--color-success)]/30", "bg-[var(--color-warning)]/40", "bg-[var(--color-error)]/50", "bg-[var(--color-error)]/80"]?.map((c, i) => (
            <div key={i} className={`w-4 h-4 rounded-sm ${c}`} />
          ))}
          <span className="font-caption text-xs text-[var(--color-muted-foreground)]">High</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Hour labels */}
          <div className="flex items-center gap-1 mb-1 ml-10">
            {hours?.map((h) => (
              <div key={h} className="flex-1 text-center font-caption text-xs text-[var(--color-muted-foreground)]">{h}</div>
            ))}
          </div>
          {/* Grid */}
          {days?.map((day, di) => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <span className="w-9 font-caption text-xs text-[var(--color-muted-foreground)] text-right pr-1 flex-shrink-0">{day}</span>
              {heatmapData?.[di]?.map((val, hi) => (
                <div key={hi} className={`flex-1 h-6 rounded-sm ${getColor(val)} transition-all hover:opacity-80 cursor-pointer`}
                  title={`${day} ${hours?.[hi]}: ${val} events`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border)]">
        <Icon name="Info" size={12} color="var(--color-muted-foreground)" />
        <span className="font-caption text-xs text-[var(--color-muted-foreground)]">Weekend off-hours activity spike detected — Saturday/Sunday 12a–6a pattern anomalous</span>
      </div>
    </div>
  );
};

export default AnomalyHeatmap;