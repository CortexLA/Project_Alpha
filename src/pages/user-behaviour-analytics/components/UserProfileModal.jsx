import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Button from "components/ui/Button";

const fileAccessData = [
  { day: "Mon", count: 24 }, { day: "Tue", count: 31 }, { day: "Wed", count: 18 },
  { day: "Thu", count: 45 }, { day: "Fri", count: 52 }, { day: "Sat", count: 38 }, { day: "Sun", count: 12 },
];

const downloadTrend = [
  { date: "02/25", mb: 120 }, { date: "02/26", mb: 145 }, { date: "02/27", mb: 98 },
  { date: "02/28", mb: 210 }, { date: "03/01", mb: 380 }, { date: "03/02", mb: 520 }, { date: "03/03", mb: 890 },
];

const failedLogins = [
  { time: "08:12 AM", ip: "192.168.1.45", location: "New York, US", reason: "Wrong password" },
  { time: "08:14 AM", ip: "192.168.1.45", location: "New York, US", reason: "Wrong password" },
  { time: "08:15 AM", ip: "10.0.0.22", location: "Chicago, US", reason: "Account locked" },
  { time: "11:32 PM", ip: "185.220.101.5", location: "Frankfurt, DE", reason: "Geo-anomaly block" },
];

const activityTimeline = [
  { time: "08:15 AM", action: "Failed login attempt (x3)", severity: "high" },
  { time: "09:02 AM", action: "Accessed /finance/reports/Q4-2025.xlsx", severity: "medium" },
  { time: "10:45 AM", action: "Downloaded 890MB from shared drive", severity: "critical" },
  { time: "11:30 AM", action: "Privilege escalation to admin role", severity: "critical" },
  { time: "02:15 PM", action: "Accessed 47 files in 12 minutes", severity: "high" },
  { time: "11:48 PM", action: "Off-hours login from Germany IP", severity: "critical" },
];

const severityColors = { critical: "var(--color-error)", high: "var(--color-warning)", medium: "var(--color-accent)", low: "var(--color-success)" };

const UserProfileModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  if (!user) return null;

  const tabs = ["overview", "file access", "downloads", "logins", "timeline"];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[var(--color-background)]/80 backdrop-blur-sm" />
      <div className="relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e?.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-[var(--color-border)]">
          <div className="relative flex-shrink-0">
            <Image src={user?.avatar} alt={user?.avatarAlt} className="w-12 h-12 rounded-full object-cover" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--color-card)] bg-[var(--color-error)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading text-base text-[var(--color-card-foreground)]">{user?.name}</h2>
              <span className="px-2 py-0.5 rounded border font-caption text-xs uppercase bg-[var(--color-error)]/10 border-[var(--color-error)]/30 text-[var(--color-error)]">{user?.badge}</span>
            </div>
            <p className="font-caption text-xs text-[var(--color-muted-foreground)] mt-0.5">{user?.role} · {user?.dept}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-caption text-xs text-[var(--color-muted-foreground)]">Risk Score:</span>
              <span className="font-data text-sm font-500 text-[var(--color-error)]">{user?.riskScore}/100</span>
              <span className="font-caption text-xs text-[var(--color-muted-foreground)]">·</span>
              <span className="font-caption text-xs text-[var(--color-muted-foreground)]">{user?.anomalies} anomalies detected</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="destructive" size="sm" iconName="AlertTriangle" iconPosition="left" iconSize={13}>Escalate</Button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--color-surface-2)] transition-colors">
              <Icon name="X" size={16} color="var(--color-muted-foreground)" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-[var(--color-border)] overflow-x-auto">
          {tabs?.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 font-caption text-xs capitalize whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-card-foreground)]"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Last Activity", value: user?.lastActivity, icon: "Clock", color: "var(--color-accent)" },
                { label: "Investigation Status", value: user?.status, icon: "Search", color: "var(--color-warning)" },
                { label: "Department", value: user?.dept, icon: "Building2", color: "var(--color-primary)" },
                { label: "Total Anomalies", value: `${user?.anomalies} events`, icon: "AlertTriangle", color: "var(--color-error)" },
              ]?.map((item) => (
                <div key={item?.label} className="flex items-center gap-3 p-3 bg-[var(--color-surface-2)] rounded-lg">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${item?.color}18` }}>
                    <Icon name={item?.icon} size={15} color={item?.color} />
                  </div>
                  <div>
                    <p className="font-caption text-xs text-[var(--color-muted-foreground)]">{item?.label}</p>
                    <p className="font-caption text-sm font-500 text-[var(--color-card-foreground)] capitalize">{item?.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "file access" && (
            <div>
              <p className="font-caption text-xs text-[var(--color-muted-foreground)] mb-3">File access frequency — last 7 days</p>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fileAccessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontFamily: "var(--font-caption)", fontSize: 12 }} />
                    <Bar dataKey="count" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "downloads" && (
            <div>
              <p className="font-caption text-xs text-[var(--color-muted-foreground)] mb-3">Data download trend (MB) — anomalous spike detected</p>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={downloadTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontFamily: "var(--font-caption)", fontSize: 12 }} />
                    <Line type="monotone" dataKey="mb" stroke="var(--color-error)" strokeWidth={2} dot={{ fill: "var(--color-error)", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "logins" && (
            <div className="flex flex-col gap-2">
              <p className="font-caption text-xs text-[var(--color-muted-foreground)] mb-1">Failed login attempts — today</p>
              {failedLogins?.map((login, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-error)]/20">
                  <Icon name="XCircle" size={14} color="var(--color-error)" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-data text-xs text-[var(--color-card-foreground)]">{login?.ip}</span>
                      <span className="font-caption text-xs text-[var(--color-muted-foreground)]">{login?.location}</span>
                    </div>
                    <span className="font-caption text-xs text-[var(--color-error)]">{login?.reason}</span>
                  </div>
                  <span className="font-data text-xs text-[var(--color-muted-foreground)] flex-shrink-0">{login?.time}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="flex flex-col gap-0">
              {activityTimeline?.map((event, i) => (
                <div key={i} className="flex gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: severityColors?.[event?.severity] }} />
                    {i < activityTimeline?.length - 1 && <div className="w-px flex-1 bg-[var(--color-border)] my-1" />}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-data text-xs text-[var(--color-muted-foreground)] flex-shrink-0">{event?.time}</span>
                      <span className="px-1.5 py-0.5 rounded font-caption text-xs uppercase border flex-shrink-0"
                        style={{ color: severityColors?.[event?.severity], backgroundColor: `${severityColors?.[event?.severity]}18`, borderColor: `${severityColors?.[event?.severity]}40` }}>
                        {event?.severity}
                      </span>
                    </div>
                    <p className="font-caption text-xs text-[var(--color-card-foreground)] mt-0.5">{event?.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;