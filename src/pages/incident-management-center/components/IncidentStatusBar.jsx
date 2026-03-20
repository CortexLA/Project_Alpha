import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const STATUS_FILTERS = [
  { key: 'all', label: 'All', count: 47 },
  { key: 'open', label: 'Open', count: 18 },
  { key: 'in_progress', label: 'In Progress', count: 14 },
  { key: 'resolved', label: 'Resolved', count: 15 },
];

const SEVERITY_FILTERS = [
  { key: 'critical', label: 'Critical', color: 'text-error', bg: 'bg-error/10 border-error/30', count: 6 },
  { key: 'high', label: 'High', color: 'text-warning', bg: 'bg-warning/10 border-warning/30', count: 11 },
  { key: 'medium', label: 'Medium', color: 'text-accent', bg: 'bg-accent/10 border-accent/30', count: 19 },
  { key: 'low', label: 'Low', color: 'text-muted-foreground', bg: 'bg-muted/50 border-border', count: 11 },
];

export default function IncidentStatusBar({
  statusFilter, setStatusFilter,
  severityFilter, setSeverityFilter,
  assigneeFilter, setAssigneeFilter,
  searchQuery, setSearchQuery,
  onExport,
}) {
  const analysts = ['All Analysts', 'A. Kumar', 'S. Patel', 'M. Chen', 'R. Williams', 'J. Torres'];

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-3 md:p-4 space-y-3">
      {/* Row 1: Search + Export */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Icon name="Search" size={15} color="var(--color-muted-foreground)" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search incidents, users, IPs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e?.target?.value)}
            className="w-full pl-9 pr-3 py-2 bg-[var(--color-surface-0)] border border-[var(--color-border)] rounded-md font-caption text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-ring)] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={assigneeFilter}
            onChange={e => setAssigneeFilter(e?.target?.value)}
            className="px-3 py-2 bg-[var(--color-surface-0)] border border-[var(--color-border)] rounded-md font-caption text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-ring)] transition-colors"
          >
            {analysts?.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left" onClick={onExport}>
            Export
          </Button>
        </div>
      </div>
      {/* Row 2: Status + Severity filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-caption text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider mr-1">Status:</span>
        {STATUS_FILTERS?.map(f => (
          <button
            key={f?.key}
            onClick={() => setStatusFilter(f?.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-caption text-xs font-500 transition-all duration-200 ${
              statusFilter === f?.key
                ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/40 text-[var(--color-primary)]'
                : 'bg-transparent border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]/50'
            }`}
          >
            {f?.label}
            <span className={`px-1.5 py-0.5 rounded text-xs font-600 ${statusFilter === f?.key ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]'}`}>
              {f?.count}
            </span>
          </button>
        ))}

        <div className="w-px h-5 bg-[var(--color-border)] mx-1 hidden sm:block" />

        <span className="font-caption text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider mr-1">Severity:</span>
        {SEVERITY_FILTERS?.map(f => (
          <button
            key={f?.key}
            onClick={() => setSeverityFilter(severityFilter === f?.key ? 'all' : f?.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-caption text-xs font-600 transition-all duration-200 ${
              severityFilter === f?.key ? f?.bg + ' ' + f?.color : 'bg-transparent border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]/50'
            }`}
          >
            {f?.label}
            <span className="opacity-70">{f?.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}