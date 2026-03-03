import React, { useState } from "react";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import Icon from "components/AppIcon";

const loginData = [
  { time: "00:00", normal: 12, suspicious: 1, baseline: 15 },
  { time: "02:00", normal: 5, suspicious: 0, baseline: 6 },
  { time: "04:00", normal: 3, suspicious: 2, baseline: 4 },
  { time: "06:00", normal: 18, suspicious: 1, baseline: 20 },
  { time: "08:00", normal: 87, suspicious: 4, baseline: 80 },
  { time: "10:00", normal: 124, suspicious: 7, baseline: 110 },
  { time: "12:00", normal: 98, suspicious: 12, baseline: 95 },
  { time: "14:00", normal: 115, suspicious: 9, baseline: 105 },
  { time: "16:00", normal: 132, suspicious: 15, baseline: 120 },
  { time: "18:00", normal: 76, suspicious: 8, baseline: 70 },
  { time: "20:00", normal: 45, suspicious: 5, baseline: 40 },
  { time: "22:00", normal: 28, suspicious: 3, baseline: 25 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-popover)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg">
      <p className="font-heading text-xs text-[var(--color-primary)] mb-2">{label}</p>
      {payload?.map((p) => (
        <div key={p?.name} className="flex items-center gap-2 font-caption text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p?.color }} />
          <span className="text-[var(--color-muted-foreground)] capitalize">{p?.name}:</span>
          <span className="text-[var(--color-card-foreground)] font-500">{p?.value}</span>
        </div>
      ))}
    </div>
  );
};

const LoginActivityChart = ({ onUserDrillDown }) => {
  const [activeView, setActiveView] = useState("all");
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 md:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-heading text-sm text-[var(--color-card-foreground)]">Login Activity Timeline</h3>
          <p className="font-caption text-xs text-[var(--color-muted-foreground)] mt-0.5">Normal vs suspicious login patterns — 24h window</p>
        </div>
        <div className="flex items-center gap-1 bg-[var(--color-surface-2)] rounded-md p-1">
          {["all", "normal", "suspicious"]?.map((v) => (
            <button key={v} onClick={() => setActiveView(v)}
              className={`px-3 py-1 rounded font-caption text-xs capitalize transition-all duration-200 ${activeView === v ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-card-foreground)]"}`}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={loginData} onClick={(d) => d?.activePayload && onUserDrillDown && onUserDrillDown(d?.activeLabel)}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontFamily: "var(--font-caption)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontFamily: "var(--font-caption)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontFamily: "var(--font-caption)", fontSize: 11, color: "var(--color-muted-foreground)" }} />
            <ReferenceLine y={100} stroke="var(--color-warning)" strokeDasharray="4 4" strokeWidth={1} label={{ value: "Threshold", fill: "var(--color-warning)", fontSize: 10 }} />
            {(activeView === "all" || activeView === "normal") && (
              <Area type="monotone" dataKey="normal" fill="rgba(0,212,170,0.08)" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
            )}
            {(activeView === "all" || activeView === "normal") && (
              <Line type="monotone" dataKey="baseline" stroke="var(--color-accent)" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
            )}
            {(activeView === "all" || activeView === "suspicious") && (
              <Line type="monotone" dataKey="suspicious" stroke="var(--color-error)" strokeWidth={2} dot={{ fill: "var(--color-error)", r: 3 }} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border)]">
        <Icon name="MousePointerClick" size={12} color="var(--color-muted-foreground)" />
        <span className="font-caption text-xs text-[var(--color-muted-foreground)]">Click any data point to drill down into user activity</span>
      </div>
    </div>
  );
};

export default LoginActivityChart;