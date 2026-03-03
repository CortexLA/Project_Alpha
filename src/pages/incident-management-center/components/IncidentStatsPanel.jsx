import React from 'react';
import Icon from 'components/AppIcon';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const SEVERITY_COLORS = {
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#94A3B8',
};

const WORKLOAD = [
  { analyst: 'A. Kumar', open: 5, inProgress: 3, avatar: 'AK', color: 'var(--color-primary)' },
  { analyst: 'S. Patel', open: 4, inProgress: 4, avatar: 'SP', color: '#3B82F6' },
  { analyst: 'M. Chen', open: 3, inProgress: 2, avatar: 'MC', color: '#F59E0B' },
  { analyst: 'R. Williams', open: 4, inProgress: 3, avatar: 'RW', color: '#10B981' },
  { analyst: 'J. Torres', open: 2, inProgress: 2, avatar: 'JT', color: '#8B5CF6' },
];

const PIE_DATA = [
  { name: 'Critical', value: 6, color: '#EF4444' },
  { name: 'High', value: 11, color: '#F59E0B' },
  { name: 'Medium', value: 19, color: '#3B82F6' },
  { name: 'Low', value: 11, color: '#94A3B8' },
];

const SLA_METRICS = [
  { label: 'Within SLA', value: 38, pct: 81, color: 'var(--color-success)' },
  { label: 'At Risk', value: 6, pct: 13, color: 'var(--color-warning)' },
  { label: 'Breached', value: 3, pct: 6, color: 'var(--color-error)' },
];

export default function IncidentStatsPanel() {
  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Active', value: 32, icon: 'AlertTriangle', color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Critical', value: 6, icon: 'Zap', color: 'text-error', bg: 'bg-error/10' },
          { label: 'Resolved Today', value: 9, icon: 'CheckCircle', color: 'text-success', bg: 'bg-success/10' },
          { label: 'Avg MTTR', value: '2.4h', icon: 'Clock', color: 'text-accent', bg: 'bg-accent/10' },
        ]?.map(stat => (
          <div key={stat?.label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-3">
            <div className={`w-8 h-8 rounded-md ${stat?.bg} flex items-center justify-center mb-2`}>
              <Icon name={stat?.icon} size={16} color={stat?.color?.replace('text-', 'var(--color-')?.replace('warning', 'warning)')?.replace('error', 'error)')?.replace('success', 'success)')?.replace('accent', 'accent)')} />
            </div>
            <p className={`font-heading text-xl font-700 ${stat?.color}`}>{stat?.value}</p>
            <p className="font-caption text-xs text-[var(--color-muted-foreground)] mt-0.5">{stat?.label}</p>
          </div>
        ))}
      </div>
      {/* Severity distribution pie */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4">
        <h3 className="font-heading text-sm text-[var(--color-foreground)] mb-3 flex items-center gap-2">
          <Icon name="PieChart" size={14} color="var(--color-primary)" />
          Severity Distribution
        </h3>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                {PIE_DATA?.map((entry, i) => <Cell key={i} fill={entry?.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: 'var(--color-foreground)' }}
                itemStyle={{ color: 'var(--color-muted-foreground)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          {PIE_DATA?.map(d => (
            <div key={d?.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d?.color }} />
              <span className="font-caption text-xs text-[var(--color-muted-foreground)]">{d?.name}</span>
              <span className="font-data text-xs text-[var(--color-foreground)] ml-auto">{d?.value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Team workload */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4">
        <h3 className="font-heading text-sm text-[var(--color-foreground)] mb-3 flex items-center gap-2">
          <Icon name="Users" size={14} color="var(--color-primary)" />
          Team Workload
        </h3>
        <div className="space-y-2.5">
          {WORKLOAD?.map(w => {
            const total = w?.open + w?.inProgress;
            const maxTotal = 10;
            return (
              <div key={w?.analyst} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-700 font-heading" style={{ background: w?.color + '20', color: w?.color, border: `1px solid ${w?.color}40` }}>
                  {w?.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-caption text-xs text-[var(--color-foreground)] truncate">{w?.analyst}</span>
                    <span className="font-data text-xs text-[var(--color-muted-foreground)] flex-shrink-0 ml-1">{total}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--color-surface-0)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(total / maxTotal) * 100}%`, background: w?.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* SLA compliance */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4">
        <h3 className="font-heading text-sm text-[var(--color-foreground)] mb-3 flex items-center gap-2">
          <Icon name="Timer" size={14} color="var(--color-primary)" />
          SLA Compliance
        </h3>
        <div className="space-y-2.5">
          {SLA_METRICS?.map(m => (
            <div key={m?.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-caption text-xs text-[var(--color-muted-foreground)]">{m?.label}</span>
                <span className="font-data text-xs font-600" style={{ color: m?.color }}>{m?.value} ({m?.pct}%)</span>
              </div>
              <div className="h-1.5 bg-[var(--color-surface-0)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${m?.pct}%`, background: m?.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}