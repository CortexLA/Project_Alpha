import React from "react";
import Icon from "components/AppIcon";

const SparkLine = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const points = data?.map((v, i) => {
    const x = (i / (data?.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  })?.join(" ");
  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const MetricCard = ({ title, value, subtitle, change, changeType, icon, iconColor, sparkData, sparkColor }) => {
  const isPositive = changeType === "positive";
  const isNegative = changeType === "negative";
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 flex flex-col gap-3 hover:border-[var(--color-primary)]/40 transition-all duration-250">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${iconColor}18` }}>
            <Icon name={icon} size={16} color={iconColor} />
          </div>
          <span className="font-caption text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider">{title}</span>
        </div>
        {sparkData && <SparkLine data={sparkData} color={sparkColor || iconColor} />}
      </div>
      <div>
        <div className="font-heading text-2xl md:text-3xl text-[var(--color-card-foreground)] font-700">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {change && (
            <span className={`flex items-center gap-0.5 font-caption text-xs font-500 ${isPositive ? "text-[var(--color-success)]" : isNegative ? "text-[var(--color-error)]" : "text-[var(--color-muted-foreground)]"}`}>
              <Icon name={isPositive ? "TrendingUp" : isNegative ? "TrendingDown" : "Minus"} size={12} color="currentColor" />
              {change}
            </span>
          )}
          {subtitle && <span className="font-caption text-xs text-[var(--color-muted-foreground)]">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;