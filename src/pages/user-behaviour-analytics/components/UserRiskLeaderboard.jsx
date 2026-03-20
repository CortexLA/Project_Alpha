import React, { useState } from "react";

import Image from "components/AppImage";


const users = [
{ id: 1, name: "James Whitfield", role: "Senior Engineer", dept: "Engineering", riskScore: 94, trend: [60, 65, 70, 78, 85, 90, 94], status: "investigating", avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_135832f23-1763294987438.png", avatarAlt: "Professional male engineer with short brown hair wearing casual blue shirt in office setting", anomalies: 12, lastActivity: "2 min ago", badge: "critical" },
{ id: 2, name: "Sandra Okonkwo", role: "Finance Analyst", dept: "Finance", riskScore: 87, trend: [50, 55, 60, 68, 75, 82, 87], status: "open", avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1336c6e7c-1763299688066.png", avatarAlt: "Professional African American woman with natural hair wearing formal blazer at finance desk", anomalies: 9, lastActivity: "15 min ago", badge: "high" },
{ id: 3, name: "Marcus Chen", role: "DevOps Lead", dept: "IT Ops", riskScore: 76, trend: [40, 45, 55, 60, 65, 72, 76], status: "open", avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1fa588d57-1763293899416.png", avatarAlt: "Asian male IT professional with glasses wearing dark polo shirt in server room environment", anomalies: 7, lastActivity: "1 hr ago", badge: "high" },
{ id: 4, name: "Priya Nair", role: "HR Manager", dept: "Human Resources", riskScore: 68, trend: [30, 35, 40, 50, 58, 63, 68], status: "monitoring", avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_194e798b6-1763300798761.png", avatarAlt: "South Asian woman with dark hair in professional attire smiling at HR office desk", anomalies: 5, lastActivity: "3 hr ago", badge: "medium" },
{ id: 5, name: "Derek Hollis", role: "Sales Director", dept: "Sales", riskScore: 61, trend: [25, 30, 38, 45, 52, 57, 61], status: "monitoring", avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_188565cef-1772541782961.png", avatarAlt: "Caucasian male sales executive with styled hair wearing business suit in conference room", anomalies: 4, lastActivity: "5 hr ago", badge: "medium" },
{ id: 6, name: "Aisha Patel", role: "Data Scientist", dept: "Analytics", riskScore: 45, trend: [20, 22, 28, 32, 38, 41, 45], status: "clear", avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_13a1bea40-1772240947501.png", avatarAlt: "Young South Asian woman data scientist with long dark hair working on laptop in modern office", anomalies: 2, lastActivity: "8 hr ago", badge: "low" }];


const MiniSparkline = ({ data, color }) => {
  const max = Math.max(...data),min = Math.min(...data),range = max - min || 1;
  const w = 48,h = 20;
  const pts = data?.map((v, i) => `${i / (data?.length - 1) * w},${h - (v - min) / range * h}`)?.join(" ");
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>);

};

const badgeConfig = {
  critical: { color: "var(--color-error)", bg: "bg-[var(--color-error)]/10 border-[var(--color-error)]/30", text: "text-[var(--color-error)]" },
  high: { color: "var(--color-warning)", bg: "bg-[var(--color-warning)]/10 border-[var(--color-warning)]/30", text: "text-[var(--color-warning)]" },
  medium: { color: "var(--color-accent)", bg: "bg-[var(--color-accent)]/10 border-[var(--color-accent)]/30", text: "text-[var(--color-accent)]" },
  low: { color: "var(--color-success)", bg: "bg-[var(--color-success)]/10 border-[var(--color-success)]/30", text: "text-[var(--color-success)]" }
};

const statusConfig = {
  investigating: { icon: "Search", color: "var(--color-error)", label: "Investigating" },
  open: { icon: "AlertCircle", color: "var(--color-warning)", label: "Open" },
  monitoring: { icon: "Eye", color: "var(--color-accent)", label: "Monitoring" },
  clear: { icon: "CheckCircle", color: "var(--color-success)", label: "Clear" }
};

const UserRiskLeaderboard = ({ onSelectUser }) => {
  const [sortBy, setSortBy] = useState("risk");
  const sorted = [...users]?.sort((a, b) => sortBy === "risk" ? b?.riskScore - a?.riskScore : b?.anomalies - a?.anomalies);

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-sm text-[var(--color-card-foreground)]">Risk Leaderboard</h3>
          <p className="font-caption text-xs text-[var(--color-muted-foreground)] mt-0.5">Top risk users</p>
        </div>
        <div className="flex items-center gap-1 bg-[var(--color-surface-2)] rounded p-0.5">
          <button onClick={() => setSortBy("risk")} className={`px-2 py-1 rounded font-caption text-xs transition-all ${sortBy === "risk" ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]" : "text-[var(--color-muted-foreground)]"}`}>Risk</button>
          <button onClick={() => setSortBy("anomalies")} className={`px-2 py-1 rounded font-caption text-xs transition-all ${sortBy === "anomalies" ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]" : "text-[var(--color-muted-foreground)]"}`}>Anomalies</button>
        </div>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {sorted?.map((user, idx) => {
          const badge = badgeConfig?.[user?.badge];
          const status = statusConfig?.[user?.status];
          return (
            <button key={user?.id} onClick={() => onSelectUser(user)}
            className="flex items-center gap-3 p-2.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-2)]/50 transition-all duration-200 text-left w-full group">
              <span className="font-data text-xs text-[var(--color-muted-foreground)] w-4 flex-shrink-0">#{idx + 1}</span>
              <div className="relative flex-shrink-0">
                <Image src={user?.avatar} alt={user?.avatarAlt} className="w-8 h-8 rounded-full object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[var(--color-card)]" style={{ backgroundColor: status?.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-caption text-xs font-500 text-[var(--color-card-foreground)] truncate">{user?.name}</span>
                  <span className={`px-1 py-0.5 rounded border font-caption text-xs uppercase flex-shrink-0 ${badge?.bg} ${badge?.text}`}>{user?.badge}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-caption text-xs text-[var(--color-muted-foreground)] truncate">{user?.dept}</span>
                  <span className="text-[var(--color-border)]">·</span>
                  <span className="font-caption text-xs text-[var(--color-muted-foreground)] flex-shrink-0">{user?.anomalies} anomalies</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="font-data text-sm font-500" style={{ color: badge?.color }}>{user?.riskScore}</span>
                <MiniSparkline data={user?.trend} color={badge?.color} />
              </div>
            </button>);

        })}
      </div>
    </div>);

};

export default UserRiskLeaderboard;