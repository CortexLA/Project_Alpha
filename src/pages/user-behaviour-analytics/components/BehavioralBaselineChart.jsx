import React, { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Icon from "components/AppIcon";

const baselineData = [
  { dimension: "Login Freq", baseline: 80, current: 95, threshold: 90 },
  { dimension: "File Access", baseline: 60, current: 88, threshold: 75 },
  { dimension: "Data Transfer", baseline: 40, current: 72, threshold: 55 },
  { dimension: "Off-Hours", baseline: 20, current: 65, threshold: 30 },
  { dimension: "Privilege Use", baseline: 50, current: 78, threshold: 65 },
  { dimension: "App Usage", baseline: 70, current: 74, threshold: 80 },
  { dimension: "Network", baseline: 55, current: 60, threshold: 70 },
];

const deviationData = [
  { label: "Login Frequency", baseline: 80, current: 95, deviation: "+18.75%", status: "warning" },
  { label: "File Access Rate", baseline: 60, current: 88, deviation: "+46.67%", status: "critical" },
  { label: "Data Transfer Volume", baseline: 40, current: 72, deviation: "+80.00%", status: "critical" },
  { label: "Off-Hours Activity", baseline: 20, current: 65, deviation: "+225.00%", status: "critical" },
  { label: "Privilege Escalation", baseline: 50, current: 78, deviation: "+56.00%", status: "high" },
  { label: "Application Usage", baseline: 70, current: 74, deviation: "+5.71%", status: "normal" },
  { label: "Network Connections", baseline: 55, current: 60, deviation: "+9.09%", status: "normal" },
];

const statusColors = { critical: "var(--color-error)", high: "var(--color-warning)", warning: "var(--color-accent)", normal: "var(--color-success)" };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-popover)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg">
      <p className="font-heading text-xs text-[var(--color-primary)] mb-1">{payload?.[0]?.payload?.dimension}</p>
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

const BehavioralBaselineChart = ({ selectedUser }) => {
  const [threshold, setThreshold] = useState(75);
  const [view, setView] = useState("radar");

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 md:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-heading text-sm text-[var(--color-card-foreground)]">Behavioral Baseline Comparison</h3>
          <p className="font-caption text-xs text-[var(--color-muted-foreground)] mt-0.5">
            {selectedUser ? `Analyzing: ${selectedUser?.name}` : "Select a user to analyze"} — ML Confidence: 94.2%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[var(--color-surface-2)] rounded-md p-1">
            {["radar", "table"]?.map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 rounded font-caption text-xs capitalize transition-all ${view === v ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]" : "text-[var(--color-muted-foreground)]"}`}>
                {v === "radar" ? "Radar" : "Table"}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Threshold Slider */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-[var(--color-surface-2)] rounded-lg">
        <Icon name="SlidersHorizontal" size={14} color="var(--color-primary)" />
        <span className="font-caption text-xs text-[var(--color-muted-foreground)] flex-shrink-0">Alert Threshold:</span>
        <input type="range" min={40} max={100} value={threshold} onChange={(e) => setThreshold(Number(e?.target?.value))}
          className="flex-1 accent-[var(--color-primary)] h-1 cursor-pointer" />
        <span className="font-data text-xs text-[var(--color-primary)] w-8 text-right flex-shrink-0">{threshold}</span>
      </div>
      {view === "radar" ? (
        <div className="w-full h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={baselineData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontFamily: "var(--font-caption)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "var(--font-caption)", fontSize: 11, color: "var(--color-muted-foreground)" }} />
              <Radar name="Baseline" dataKey="baseline" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.1} strokeWidth={1.5} />
              <Radar name="Current" dataKey="current" stroke="var(--color-error)" fill="var(--color-error)" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Threshold" dataKey="threshold" stroke="var(--color-warning)" fill="none" strokeWidth={1} strokeDasharray="4 2" />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Dimension", "Baseline", "Current", "Deviation", "Status"]?.map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-caption text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deviationData?.map((row) => (
                <tr key={row?.label} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface-2)]/50 transition-colors">
                  <td className="py-2.5 px-3 font-caption text-xs text-[var(--color-card-foreground)]">{row?.label}</td>
                  <td className="py-2.5 px-3 font-data text-xs text-[var(--color-muted-foreground)]">{row?.baseline}</td>
                  <td className="py-2.5 px-3 font-data text-xs text-[var(--color-card-foreground)] font-500">{row?.current}</td>
                  <td className="py-2.5 px-3 font-data text-xs" style={{ color: statusColors?.[row?.status] }}>{row?.deviation}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded font-caption text-xs uppercase border"
                      style={{ color: statusColors?.[row?.status], backgroundColor: `${statusColors?.[row?.status]}18`, borderColor: `${statusColors?.[row?.status]}40` }}>
                      {row?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BehavioralBaselineChart;