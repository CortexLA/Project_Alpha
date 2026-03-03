import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import Icon from "components/AppIcon";

const RISK_DATA = [
  { range: "0-10", count: 142, label: "Minimal" },
  { range: "11-20", count: 98, label: "Low" },
  { range: "21-30", count: 76, label: "Low" },
  { range: "31-40", count: 54, label: "Moderate" },
  { range: "41-50", count: 43, label: "Moderate" },
  { range: "51-60", count: 31, label: "Elevated" },
  { range: "61-70", count: 22, label: "High" },
  { range: "71-80", count: 14, label: "High" },
  { range: "81-90", count: 8, label: "Critical" },
  { range: "91-100", count: 4, label: "Critical" },
];

const getBarColor = (range) => {
  const start = parseInt(range?.split("-")?.[0]);
  if (start >= 81) return "#EF4444";
  if (start >= 61) return "#F59E0B";
  if (start >= 41) return "#3B82F6";
  if (start >= 21) return "#00D4AA";
  return "#10B981";
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg">
      <p className="font-heading text-xs text-[var(--color-primary)] mb-1">Risk Score: {label}</p>
      <p className="font-caption text-xs text-[var(--color-muted-foreground)]">
        Users: <span className="font-data text-[var(--color-card-foreground)]">{payload?.[0]?.value}</span>
      </p>
      <p className="font-caption text-xs text-[var(--color-muted-foreground)]">
        Category: <span className="font-data text-[var(--color-card-foreground)]">{payload?.[0]?.payload?.label}</span>
      </p>
    </div>
  );
};

export default function RiskDistributionChart() {
  const totalUsers = RISK_DATA?.reduce((sum, d) => sum + d?.count, 0);
  const highRiskUsers = RISK_DATA?.filter(d => parseInt(d?.range) >= 61)?.reduce((sum, d) => sum + d?.count, 0);

  return (
    <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="BarChart2" size={16} color="var(--color-primary)" />
          <span className="font-heading text-sm text-[var(--color-card-foreground)]">Risk Score Distribution</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#EF4444]/10 border border-[#EF4444]/30">
          <Icon name="AlertTriangle" size={11} color="var(--color-error)" />
          <span className="font-data text-xs text-[#EF4444]">{highRiskUsers} high-risk</span>
        </div>
      </div>
      <div className="w-full h-40 md:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={RISK_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} vertical={false} />
            <XAxis
              dataKey="range"
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 9, fontFamily: "var(--font-data)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <YAxis
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 9, fontFamily: "var(--font-data)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {RISK_DATA?.map((entry) => (
                <Cell key={entry?.range} fill={getBarColor(entry?.range)} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]">
        <div className="text-center">
          <p className="font-data text-sm text-[var(--color-card-foreground)]">{totalUsers}</p>
          <p className="font-caption text-xs text-[var(--color-muted-foreground)]">Total Users</p>
        </div>
        <div className="text-center">
          <p className="font-data text-sm text-[#F59E0B]">26</p>
          <p className="font-caption text-xs text-[var(--color-muted-foreground)]">Avg Score</p>
        </div>
        <div className="text-center">
          <p className="font-data text-sm text-[#EF4444]">{highRiskUsers}</p>
          <p className="font-caption text-xs text-[var(--color-muted-foreground)]">High Risk</p>
        </div>
      </div>
    </div>
  );
}