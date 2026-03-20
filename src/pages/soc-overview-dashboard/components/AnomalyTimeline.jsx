import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,  } from "recharts";
import Icon from "components/AppIcon";

const TIMELINE_DATA = [
  { time: "00:00", anomalies: 2, threats: 0, logins: 45 },
  { time: "01:00", anomalies: 1, threats: 0, logins: 22 },
  { time: "02:00", anomalies: 3, threats: 1, logins: 18 },
  { time: "03:00", anomalies: 1, threats: 0, logins: 12 },
  { time: "04:00", anomalies: 2, threats: 0, logins: 15 },
  { time: "05:00", anomalies: 4, threats: 1, logins: 28 },
  { time: "06:00", anomalies: 6, threats: 2, logins: 87 },
  { time: "07:00", anomalies: 8, threats: 2, logins: 142 },
  { time: "08:00", anomalies: 12, threats: 3, logins: 198 },
  { time: "09:00", anomalies: 18, threats: 5, logins: 245 },
  { time: "10:00", anomalies: 15, threats: 4, logins: 231 },
  { time: "11:00", anomalies: 22, threats: 7, logins: 218 },
  { time: "12:00", anomalies: 19, threats: 6, logins: 195 },
  { time: "13:00", anomalies: 24, threats: 8, logins: 210 },
  { time: "14:00", anomalies: 31, threats: 11, logins: 228 },
  { time: "15:00", anomalies: 28, threats: 9, logins: 215 },
  { time: "16:00", anomalies: 35, threats: 12, logins: 202 },
  { time: "17:00", anomalies: 29, threats: 10, logins: 188 },
  { time: "18:00", anomalies: 21, threats: 7, logins: 156 },
  { time: "19:00", anomalies: 16, threats: 5, logins: 124 },
  { time: "20:00", anomalies: 11, threats: 3, logins: 98 },
  { time: "21:00", anomalies: 8, threats: 2, logins: 76 },
  { time: "22:00", anomalies: 6, threats: 1, logins: 58 },
  { time: "23:00", anomalies: 4, threats: 1, logins: 42 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg">
      <p className="font-heading text-xs text-[var(--color-primary)] mb-2">{label}</p>
      {payload?.map((entry) => (
        <div key={entry?.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry?.color }} />
          <span className="font-caption text-xs text-[var(--color-muted-foreground)] capitalize">{entry?.dataKey}:</span>
          <span className="font-data text-xs text-[var(--color-card-foreground)]">{entry?.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnomalyTimeline() {
  const [activeMetric, setActiveMetric] = useState("all");

  const metrics = [
    { key: "all", label: "All Metrics" },
    { key: "anomalies", label: "Anomalies" },
    { key: "threats", label: "Threats" },
    { key: "logins", label: "Logins" },
  ];

  return (
    <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] p-4 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Activity" size={16} color="var(--color-primary)" />
          <span className="font-heading text-sm text-[var(--color-card-foreground)]">Suspicious Activity Timeline</span>
          <span className="font-caption text-xs text-[var(--color-muted-foreground)]">— Today (24h)</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {metrics?.map(m => (
            <button
              key={m?.key}
              onClick={() => setActiveMetric(m?.key)}
              className={`flex-shrink-0 px-2.5 py-1 rounded font-caption text-xs transition-all duration-200 ${
                activeMetric === m?.key
                  ? "bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-[var(--color-primary)]"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-card-foreground)] border border-transparent"
              }`}
            >
              {m?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-48 md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TIMELINE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="anomalyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="loginGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
            <XAxis
              dataKey="time"
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10, fontFamily: "var(--font-data)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
              interval={3}
            />
            <YAxis
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10, fontFamily: "var(--font-data)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x="14:00" stroke="#EF4444" strokeDasharray="3 3" opacity={0.5} label={{ value: "Peak", fill: "#EF4444", fontSize: 10 }} />
            {(activeMetric === "all" || activeMetric === "logins") && (
              <Area type="monotone" dataKey="logins" stroke="#3B82F6" strokeWidth={1.5} fill="url(#loginGrad)" dot={false} />
            )}
            {(activeMetric === "all" || activeMetric === "anomalies") && (
              <Area type="monotone" dataKey="anomalies" stroke="#F59E0B" strokeWidth={1.5} fill="url(#anomalyGrad)" dot={false} />
            )}
            {(activeMetric === "all" || activeMetric === "threats") && (
              <Area type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={2} fill="url(#threatGrad)" dot={false} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-[var(--color-border)]">
        {[
          { label: "Peak Anomalies", value: "35", time: "16:00", color: "#F59E0B" },
          { label: "Peak Threats", value: "12", time: "16:00", color: "#EF4444" },
          { label: "Total Logins", value: "3,247", time: "Today", color: "#3B82F6" },
        ]?.map(stat => (
          <div key={stat?.label} className="text-center">
            <p className="font-data text-sm font-600" style={{ color: stat?.color }}>{stat?.value}</p>
            <p className="font-caption text-xs text-[var(--color-muted-foreground)]">{stat?.label}</p>
            <p className="font-data text-xs text-[var(--color-muted-foreground)]/60">{stat?.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}