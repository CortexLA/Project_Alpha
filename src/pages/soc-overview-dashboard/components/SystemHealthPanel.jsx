import React, { useState, useEffect } from "react";
import Icon from "components/AppIcon";

const SERVICES = [
  { id: 1, name: "SIEM Engine", status: "operational", latency: "12ms", uptime: "99.98%", icon: "Database" },
  { id: 2, name: "Auth Service", status: "operational", latency: "8ms", uptime: "99.99%", icon: "Key" },
  { id: 3, name: "ML Pipeline", status: "degraded", latency: "145ms", uptime: "97.2%", icon: "Cpu" },
  { id: 4, name: "Alert Engine", status: "operational", latency: "5ms", uptime: "99.95%", icon: "Bell" },
  { id: 5, name: "Log Collector", status: "operational", latency: "22ms", uptime: "99.87%", icon: "FileText" },
  { id: 6, name: "Geo-IP Service", status: "offline", latency: "—", uptime: "0%", icon: "MapPin" },
];

const METRICS = [
  { label: "CPU Usage", value: 67, unit: "%", color: "#F59E0B", threshold: 80 },
  { label: "Memory", value: 54, unit: "%", color: "#3B82F6", threshold: 85 },
  { label: "Disk I/O", value: 38, unit: "%", color: "#10B981", threshold: 90 },
  { label: "Network", value: 82, unit: "%", color: "#EF4444", threshold: 80 },
];

const statusConfig = {
  operational: { color: "text-[#10B981]", dot: "bg-[#10B981]", label: "OK" },
  degraded: { color: "text-[#F59E0B]", dot: "bg-[#F59E0B] animate-pulse", label: "DEG" },
  offline: { color: "text-[#EF4444]", dot: "bg-[#EF4444] animate-pulse", label: "OFF" },
};

export default function SystemHealthPanel() {
  const [metrics, setMetrics] = useState(METRICS);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev =>
        prev?.map(m => ({
          ...m,
          value: Math.min(99, Math.max(10, m?.value + (Math.random() * 6 - 3))),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Activity" size={16} color="var(--color-primary)" />
        <span className="font-heading text-sm text-[var(--color-card-foreground)]">System Health</span>
        <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span className="font-data text-xs text-[#10B981]">4/6 Online</span>
        </span>
      </div>
      {/* Resource metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {metrics?.map(metric => (
          <div key={metric?.label} className="bg-[var(--color-surface-0)] rounded-md p-2.5 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-caption text-xs text-[var(--color-muted-foreground)]">{metric?.label}</span>
              <span
                className="font-data text-xs font-600"
                style={{ color: metric?.value >= metric?.threshold ? "#EF4444" : metric?.color }}
              >
                {Math.round(metric?.value)}{metric?.unit}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${metric?.value}%`,
                  backgroundColor: metric?.value >= metric?.threshold ? "#EF4444" : metric?.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Services */}
      <div className="space-y-1.5">
        <p className="font-caption text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2">Services</p>
        {SERVICES?.map(service => {
          const cfg = statusConfig?.[service?.status];
          return (
            <div
              key={service?.id}
              className="flex items-center gap-2 px-2.5 py-2 rounded-md bg-[var(--color-surface-0)] border border-[var(--color-border)] hover:border-[var(--color-muted)] transition-colors duration-200"
            >
              <Icon name={service?.icon} size={13} color="var(--color-muted-foreground)" />
              <span className="font-caption text-xs text-[var(--color-card-foreground)] flex-1 truncate">{service?.name}</span>
              <span className="font-data text-xs text-[var(--color-muted-foreground)]">{service?.latency}</span>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg?.dot}`} />
                <span className={`font-data text-xs ${cfg?.color}`}>{cfg?.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}