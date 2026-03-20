import React, { useState } from "react";
import Icon from "components/AppIcon";


const ALERTS = [
  {
    id: "ALT-001",
    severity: "critical",
    title: "Brute Force Attack Detected",
    user: "jsmith@corp.com",
    source: "192.168.1.45",
    time: "2 min ago",
    timestamp: "12:30:14",
    category: "Authentication",
    assigned: false,
  },
  {
    id: "ALT-002",
    severity: "high",
    title: "Privilege Escalation Attempt",
    user: "mwilson@corp.com",
    source: "WKSTN-042",
    time: "8 min ago",
    timestamp: "12:24:07",
    category: "Access Control",
    assigned: true,
    assignee: "A. Kumar",
  },
  {
    id: "ALT-003",
    severity: "high",
    title: "Unusual Data Exfiltration",
    user: "rjones@corp.com",
    source: "10.0.2.88",
    time: "15 min ago",
    timestamp: "12:17:33",
    category: "Data Loss",
    assigned: false,
  },
  {
    id: "ALT-004",
    severity: "medium",
    title: "Anomalous Login Location",
    user: "tlee@corp.com",
    source: "VPN-Gateway",
    time: "22 min ago",
    timestamp: "12:10:55",
    category: "Geo-Anomaly",
    assigned: true,
    assignee: "S. Patel",
  },
  {
    id: "ALT-005",
    severity: "medium",
    title: "After-Hours File Access",
    user: "dchen@corp.com",
    source: "FS-PROD-01",
    time: "31 min ago",
    timestamp: "12:01:22",
    category: "File Access",
    assigned: false,
  },
  {
    id: "ALT-006",
    severity: "low",
    title: "Policy Violation - USB Device",
    user: "bmartin@corp.com",
    source: "WKSTN-017",
    time: "45 min ago",
    timestamp: "11:47:09",
    category: "Endpoint",
    assigned: false,
  },
  {
    id: "ALT-007",
    severity: "critical",
    title: "Ransomware Signature Detected",
    user: "system",
    source: "SRV-DB-03",
    time: "52 min ago",
    timestamp: "11:40:18",
    category: "Malware",
    assigned: true,
    assignee: "A. Kumar",
  },
  {
    id: "ALT-008",
    severity: "low",
    title: "Multiple Failed MFA Attempts",
    user: "kpatel@corp.com",
    source: "Auth-Service",
    time: "1 hr ago",
    timestamp: "11:32:44",
    category: "Authentication",
    assigned: false,
  },
];

const severityConfig = {
  critical: { bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/40", text: "text-[#EF4444]", dot: "bg-[#EF4444]", label: "CRIT" },
  high: { bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/40", text: "text-[#F59E0B]", dot: "bg-[#F59E0B]", label: "HIGH" },
  medium: { bg: "bg-[#3B82F6]/10", border: "border-[#3B82F6]/40", text: "text-[#3B82F6]", dot: "bg-[#3B82F6]", label: "MED" },
  low: { bg: "bg-[#10B981]/10", border: "border-[#10B981]/40", text: "text-[#10B981]", dot: "bg-[#10B981]", label: "LOW" },
};

export default function LiveAlertFeed({ onInvestigate }) {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? alerts : alerts?.filter(a => a?.severity === filter);

  const handleAssign = (id) => {
    setAlerts(prev =>
      prev?.map(a => a?.id === id ? { ...a, assigned: true, assignee: "A. Kumar" } : a)
    );
  };

  const handleDismiss = (id) => {
    setAlerts(prev => prev?.filter(a => a?.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          <span className="font-heading text-sm text-[var(--color-card-foreground)]">Live Alert Feed</span>
          <span className="px-1.5 py-0.5 rounded bg-[#EF4444]/20 border border-[#EF4444]/30 font-data text-xs text-[#EF4444]">
            {alerts?.filter(a => !a?.assigned)?.length} unassigned
          </span>
        </div>
        <Icon name="RefreshCw" size={14} color="var(--color-muted-foreground)" />
      </div>
      {/* Filter tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--color-border)] flex-shrink-0 overflow-x-auto">
        {["all", "critical", "high", "medium", "low"]?.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-2 py-1 rounded font-caption text-xs capitalize transition-all duration-200 ${
              filter === f
                ? "bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-[var(--color-primary)]"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-card-foreground)] hover:bg-[var(--color-muted)]/50"
            }`}
          >
            {f === "all" ? `All (${alerts?.length})` : f}
          </button>
        ))}
      </div>
      {/* Alert list */}
      <div className="flex-1 overflow-y-auto">
        {filtered?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-[var(--color-muted-foreground)]">
            <Icon name="CheckCircle" size={28} color="var(--color-success)" />
            <p className="font-caption text-sm mt-2">No alerts in this category</p>
          </div>
        ) : (
          filtered?.map((alert) => {
            const cfg = severityConfig?.[alert?.severity];
            return (
              <div
                key={alert?.id}
                className={`px-3 py-3 border-b border-[var(--color-border)]/50 last:border-0 hover:bg-[var(--color-muted)]/20 transition-all duration-200 group`}
              >
                <div className="flex items-start gap-2">
                  {/* Severity badge */}
                  <div className={`flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded border ${cfg?.bg} ${cfg?.border} font-data text-xs font-600 ${cfg?.text}`}>
                    {cfg?.label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-caption text-xs font-500 text-[var(--color-card-foreground)] leading-tight line-clamp-2">
                        {alert?.title}
                      </p>
                      <span className="font-data text-xs text-[var(--color-muted-foreground)] flex-shrink-0 ml-1">{alert?.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-data text-xs text-[var(--color-muted-foreground)] truncate">{alert?.user}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--color-border)] flex-shrink-0" />
                      <span className="font-data text-xs text-[var(--color-muted-foreground)] truncate">{alert?.source}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-[var(--color-muted)]/50 font-caption text-xs text-[var(--color-muted-foreground)]">
                        {alert?.category}
                      </span>
                      {alert?.assigned ? (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/20 font-caption text-xs text-[#10B981]">
                          <Icon name="User" size={9} color="var(--color-success)" />
                          {alert?.assignee}
                        </span>
                      ) : (
                        <span className="font-caption text-xs text-[var(--color-muted-foreground)]">{alert?.time}</span>
                      )}
                    </div>
                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => onInvestigate && onInvestigate(alert)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 font-caption text-xs text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors duration-200"
                      >
                        <Icon name="Search" size={10} color="var(--color-primary)" />
                        Investigate
                      </button>
                      {!alert?.assigned && (
                        <button
                          onClick={() => handleAssign(alert?.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--color-muted)]/50 border border-[var(--color-border)] font-caption text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-card-foreground)] transition-colors duration-200"
                        >
                          <Icon name="UserPlus" size={10} color="currentColor" />
                          Assign
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(alert?.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--color-muted)]/30 border border-[var(--color-border)] font-caption text-xs text-[var(--color-muted-foreground)] hover:text-[#EF4444] transition-colors duration-200"
                      >
                        <Icon name="X" size={10} color="currentColor" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[var(--color-border)] flex-shrink-0 bg-[var(--color-muted)]/10">
        <button
          onClick={() => onInvestigate && onInvestigate(null)}
          className="w-full flex items-center justify-center gap-1.5 font-caption text-xs text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors duration-200"
        >
          <span>View all in Incident Management</span>
          <Icon name="ArrowRight" size={12} color="currentColor" />
        </button>
      </div>
    </div>
  );
}