import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import Icon from "components/AppIcon";

const WEEKLY_DATA = [
  { day: "Mon", thisWeek: 45, lastWeek: 38, baseline: 40 },
  { day: "Tue", thisWeek: 62, lastWeek: 42, baseline: 40 },
  { day: "Wed", thisWeek: 58, lastWeek: 55, baseline: 40 },
  { day: "Thu", thisWeek: 71, lastWeek: 48, baseline: 40 },
  { day: "Fri", thisWeek: 89, lastWeek: 61, baseline: 40 },
  { day: "Sat", thisWeek: 34, lastWeek: 29, baseline: 40 },
  { day: "Sun", thisWeek: 28, lastWeek: 22, baseline: 40 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg">
      <p className="font-heading text-xs text-[var(--color-primary)] mb-2">{label}</p>
      {payload?.map(entry => (
        <div key={entry?.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry?.color }} />
          <span className="font-caption text-xs text-[var(--color-muted-foreground)]">
            {entry?.dataKey === "thisWeek" ? "This Week" : entry?.dataKey === "lastWeek" ? "Last Week" : "Baseline"}:
          </span>
          <span className="font-data text-xs text-[var(--color-card-foreground)]">{entry?.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function WeeklyAnomalyChart() {
  const thisWeekTotal = WEEKLY_DATA?.reduce((s, d) => s + d?.thisWeek, 0);
  const lastWeekTotal = WEEKLY_DATA?.reduce((s, d) => s + d?.lastWeek, 0);
  const pctChange = (((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100)?.toFixed(1);

  return (
    <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="TrendingUp" size={16} color="var(--color-warning)" />
          <span className="font-heading text-sm text-[var(--color-card-foreground)]">Weekly Anomaly Trend</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded border font-data text-xs ${
          parseFloat(pctChange) > 0
            ? "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
            : "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
        }`}>
          <Icon name={parseFloat(pctChange) > 0 ? "TrendingUp" : "TrendingDown"} size={11} color="currentColor" />
          {pctChange}% vs last week
        </div>
      </div>
      <div className="w-full h-40 md:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={WEEKLY_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
            <XAxis
              dataKey="day"
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10, fontFamily: "var(--font-data)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <YAxis
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10, fontFamily: "var(--font-data)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={40} stroke="#00D4AA" strokeDasharray="4 4" opacity={0.5} />
            <Line type="monotone" dataKey="lastWeek" stroke="#334155" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="baseline" stroke="#00D4AA" strokeWidth={1} dot={false} opacity={0.5} />
            <Line type="monotone" dataKey="thisWeek" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--color-border)]">
        {[
          { label: "This Week", value: thisWeekTotal, color: "#F59E0B" },
          { label: "Last Week", value: lastWeekTotal, color: "#334155" },
          { label: "Baseline", value: "40/day", color: "#00D4AA" },
        ]?.map(item => (
          <div key={item?.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item?.color }} />
            <span className="font-caption text-xs text-[var(--color-muted-foreground)]">{item?.label}:</span>
            <span className="font-data text-xs text-[var(--color-card-foreground)]">{item?.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}