import React from "react";
import Icon from "components/AppIcon";

const statusColors = {
  green: {
    bg: "bg-[#10B981]/10",
    border: "border-[#10B981]/30",
    text: "text-[#10B981]",
    dot: "bg-[#10B981]",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.2)]",
  },
  amber: {
    bg: "bg-[#F59E0B]/10",
    border: "border-[#F59E0B]/30",
    text: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.2)]",
  },
  red: {
    bg: "bg-[#EF4444]/10",
    border: "border-[#EF4444]/30",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
    glow: "shadow-[0_0_12px_rgba(239,68,68,0.2)]",
  },
  blue: {
    bg: "bg-[#3B82F6]/10",
    border: "border-[#3B82F6]/30",
    text: "text-[#3B82F6]",
    dot: "bg-[#3B82F6]",
    glow: "shadow-[0_0_12px_rgba(59,130,246,0.2)]",
  },
};

export default function KPICard({ icon, label, value, subValue, status, trend, trendValue, pulse }) {
  const colors = statusColors?.[status] || statusColors?.blue;

  return (
    <div
      className={`relative flex flex-col gap-2 p-4 rounded-lg border ${colors?.bg} ${colors?.border} ${colors?.glow} transition-all duration-250 hover:-translate-y-0.5 hover:shadow-lg cursor-default`}
    >
      <div className="flex items-center justify-between">
        <div className={`flex items-center justify-center w-9 h-9 rounded-md ${colors?.bg} border ${colors?.border}`}>
          <Icon name={icon} size={18} color={`var(--color-${status === "green" ? "success" : status === "red" ? "error" : status === "amber" ? "warning" : "accent"})`} strokeWidth={2} />
        </div>
        <div className="flex items-center gap-1.5">
          {pulse && (
            <span className={`w-2 h-2 rounded-full ${colors?.dot} animate-pulse`} />
          )}
          {trend && (
            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${colors?.bg} border ${colors?.border}`}>
              <Icon
                name={trend === "up" ? "TrendingUp" : "TrendingDown"}
                size={11}
                color={trend === "up" ? (status === "red" ? "var(--color-error)" : "var(--color-success)") : "var(--color-success)"}
              />
              <span className={`font-data text-xs ${colors?.text}`}>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
      <div>
        <p className={`font-heading font-700 text-xl md:text-2xl ${colors?.text} leading-none`}>{value}</p>
        {subValue && (
          <p className="font-caption text-xs text-[var(--color-muted-foreground)] mt-0.5">{subValue}</p>
        )}
      </div>
      <p className="font-caption text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider">{label}</p>
    </div>
  );
}